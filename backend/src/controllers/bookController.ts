import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../config/cloudinary';
import Book from '../models/Book';

// Multer configuration
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'coverImage') {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed for cover'));
            return;
        }
    } else if (file.fieldname === 'ebooks') {
        if (!['application/pdf', 'application/epub+zip'].includes(file.mimetype)) {
            cb(new Error('Only PDF and EPUB files are allowed'));
            return;
        }
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// const uploadToCloudinary = (fileBuffer: Buffer, options: any): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
//             if (error) reject(error);
//             else resolve(result?.secure_url || '');
//         });
//         uploadStream.end(fileBuffer);
//     });
// };

const uploadToCloudinary = async (fileBuffer: Buffer, options: any): Promise<string> => {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { ...options, timeout: 600000 },  // Increase timeout to 10 minutes
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || '');
          }
        );
        uploadStream.end(fileBuffer);
      });
      return result as string;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

export const addBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    upload.fields([
        { name: 'ebooks', maxCount: 2 },
        { name: 'coverImage', maxCount: 1 }
    ])(req, res, async (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({ error: err.message });
        }
 
        try {
            console.log("Raw request body:", req.body);
            console.log("Files received:", req.files);
 
            const { title, description, price, formats } = req.body;
            const bookId = `${Date.now()}-${formats.split(',')[0]}`;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
 
            if (!files?.ebooks?.[0] || !files?.coverImage?.[0]) {
                return res.status(400).json({ error: 'Missing required files' });
            }
 
            const formatArray = formats.split(',');
            const coverImage = await uploadToCloudinary(files.coverImage[0].buffer, {
                folder: 'covers',
                timeout: 300000,
                public_id: `cover-${uuidv4()}`
            });
 
            const filePaths: { [key: string]: string } = {};
            await Promise.all(files.ebooks.map(async (file, index) => {
                const format = formatArray[index];
                if (!format) throw new Error('Format missing for ebook');
                
                const folder = format.toLowerCase() === 'pdf' ? 'ebooks/pdf' : 'ebooks/epub';
                const result = await uploadToCloudinary(file.buffer, {
                    folder,
                    resource_type: 'raw',
                    timeout: 300000
                });
                filePaths[format.toLowerCase()] = result;
            }));
 
            const book = await Book.create({
                id: bookId,
                title,
                description,
                price: parseFloat(price),
                formats: formatArray,
                coverImagePaths: [coverImage],
                filePaths,
                status: 'active'
            });
 
            res.status(201).json({ message: 'Book added successfully', book });
 
        } catch (error: any) {
            console.error('Error adding book:', error);
            res.status(500).json({ error: error.message || 'Error uploading book' });
        }
    });
 };

export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    upload.fields([{ name: 'ebooks', maxCount: 2 }, { name: 'coverImages', maxCount: 1 }])(req as any, res, async (err) => {
        if (err) {
            return next(err);
        }
        try {
            const { id } = req.params;
            const { title, description, price, formats, status } = req.body;

            const book = await Book.findByPk(id);
            if (!book) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const filePaths: { [key: string]: string } = book.filePaths;

            if (files && files['ebooks']) {
                if (typeof formats === 'string') {
                    await Promise.all(formats.split(',').map(async (format: string, index: number) => {
                        const result = await new Promise<any>((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream(
                                {
                                    resource_type: 'raw',
                                    folder: 'ebooks',
                                    timeout: 120000 // 120 seconds
                                },
                                (error, result) => {
                                    if (error) reject(error);
                                    else resolve(result);
                                }
                            );
                            uploadStream.end(files['ebooks'][index].buffer);
                        });
                        filePaths[format.toLowerCase()] = result.secure_url;
                    }));
                } else {
                    res.status(400).json({ message: 'Invalid formats' });
                    return;
                }
            }

            if (files && files['coverImages']) {
                book.coverImagePaths = await Promise.all(files['coverImages'].map(file =>
                    new Promise<string>((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                folder: 'covers',
                                timeout: 120000 // 120 seconds
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result?.secure_url || '');
                            }
                        ).end(file.buffer);
                    })
                ));
            }

            book.title = title;
            book.description = description;
            book.price = parseFloat(price);
            book.formats = typeof formats === 'string' ? formats.split(',') : [];
            book.filePaths = filePaths;
            book.status = status;

            await book.save();

            res.status(200).json({ message: 'Book updated successfully', book });
        } catch (error) {
            next(error);
        }
    });
};
export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }{ 
    const { id } = req.params;
    console.log('Params:', req.params);  // Add this line
    
    const book = await Book.findByPk(id);
    console.log('Found book:', book); 
    }
};


export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        console.log('Looking for book with ID:', id);

        if (!id) {
            console.log('No ID provided');
            res.status(400).json({ message: 'Book ID is required' });
            return;
        }

        const book = await Book.findByPk(id, {
            attributes: [
                'id',
                'title',
                'description',
                'price',
                'formats',
                'filePaths',
                'coverImagePaths',
                'status'
            ]
        });

        console.log('Database query result:', book);

        if (!book) {
            console.log('Book not found for ID:', id);
            res.status(404).json({
                message: 'Book not found',
                requestedId: id
            });
            return;
        }

        const bookData = {
            id: book.id,
            title: book.title,
            description: book.description,
            price: parseFloat(book.price.toString()),
            formats: book.formats,
            filePaths: book.filePaths,
            coverImagePaths: book.coverImagePaths,
            status: book.status
        };

        console.log('Sending book data:', bookData);
        res.status(200).json(bookData);

    } catch (error) {
        console.error('Error in getBookById:', error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'Error fetching book',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'Unknown error occurred'
            });
        }
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const bookId = req.params.id as string;
        console.log("🚀 ~ deleteBook ~ req.params:", req.params)

        const book = await Book.findOne({ where: { id : bookId} });
         console.log("🚀 ~ deleteBook ~ book:", book)
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        await book.destroy();

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        next(error);
    }

    
};
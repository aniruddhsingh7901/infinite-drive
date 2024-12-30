interface EmailTemplateProps {
    orderId: string;
    downloadLink: string;
    expiresIn: string;
  }
  
  export default function EmailTemplate({ 
    orderId, 
    downloadLink, 
    expiresIn 
  }: EmailTemplateProps) {
    return (
      <div className="bg-white p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Your Infinite Drive Download</h1>
            <p className="text-gray-600">Order #{orderId}</p>
          </div>
  
          <div>
            <p>Thank you for your purchase! Your ebook is ready for download.</p>
          </div>
  
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">Download Link:</p>
            <a 
              href={downloadLink}
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {downloadLink}
            </a>
            <p className="text-sm text-blue-800 mt-2">
              Link expires in {expiresIn}
            </p>
          </div>
  
          <div className="border-t pt-6">
            <h2 className="font-medium mb-2">Important Information:</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Link expires in 24 hours</li>
              <li>• Maximum 3 download attempts</li>
              <li>• Available in PDF & EPUB formats</li>
            </ul>
          </div>
  
          <div className="text-sm text-gray-500">
            <p>If you have any issues, please contact our support.</p>
          </div>
        </div>
      </div>
    );
  }
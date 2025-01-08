import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Book extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public price!: number;
    public formats!: string[];
    public filePaths!: { [key: string]: string };
    public coverImagePaths!: string[];
    public status!: string;
}

Book.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => `${Date.now()}-PDF/EPUB`, // This matches your format
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        formats: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        filePaths: {
            type: DataTypes.JSONB,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('filePaths');
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            },
            set(value: { [key: string]: string }) {
                this.setDataValue('filePaths', JSON.stringify(value));
            },
        },
        coverImagePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        modelName: 'Book',
    }
);

export default Book;
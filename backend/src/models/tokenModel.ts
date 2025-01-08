// src/models/downloadToken.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DownloadToken extends Model {
    declare id: string;
    declare orderId: string;
    declare token: string;
    declare isUsed: boolean;
    declare expiresAt: Date;
}

DownloadToken.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
},
    {
    sequelize,
    modelName: 'DownloadToken',
    tableName: 'download_tokens'
});

export default DownloadToken;
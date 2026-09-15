import mongoose, { Schema, Document } from 'mongoose';

export interface ICanvas extends Document {
  name: string;
  width: number;
  height: number;
  elements: any[];
  thumbnail?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CanvasSchema = new Schema<ICanvas>(
  {
    name: { type: String, required: true },
    width: { type: Number, default: 1920 },
    height: { type: Number, default: 1080 },
    elements: { type: Schema.Types.Mixed, default: [] },
    thumbnail: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const CanvasModel = mongoose.models.Canvas || mongoose.model<ICanvas>('Canvas', CanvasSchema);

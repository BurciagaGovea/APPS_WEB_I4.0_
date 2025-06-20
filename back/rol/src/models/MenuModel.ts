import { Schema, model, Document, Types } from 'mongoose';

export interface IMenu extends Document {
  label: string;
  path: string;
  icon: string;
  roles: Types.ObjectId[];
}

const menuSchema = new Schema<IMenu>(
  {
    label: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  },
  { timestamps: true }
);

export const Menu = model<IMenu>('Menu', menuSchema, 'menus');
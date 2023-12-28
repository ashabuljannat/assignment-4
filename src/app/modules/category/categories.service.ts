/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { TCategory } from './categories.interface';
import { Category } from './categories.model';

const createCategoryIntoDB = async (payload: TCategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoryFromDB = async () => {
  const result = await Category.find().populate({
    path: 'createdBy',
    select: '-createdAt -updatedAt',
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
};

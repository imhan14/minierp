import {
  CreateProductData,
  ProductFilters,
  UpdateProductData,
} from "@/types/product.type";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const getProductsService = async (filters: ProductFilters) => {
  const { id, search, unit, orderBy } = filters;
  const where: Prisma.productsWhereInput = {};
  if (id) where.id = id;
  if (unit) where.unit = unit;
  if (search && search.trim() !== "") {
    const searchTrim = search.trim();
    const searchCode = searchTrim;
    const orConditions: Prisma.productsWhereInput[] = [
      { product_name: { contains: searchTrim, mode: "insensitive" } },
    ];
    if (!searchCode) {
      orConditions.push({ product_code: searchCode });
    }
    where.OR = orConditions;
  }
  let sortField = "id";
  let sortDirection: Prisma.SortOrder = "asc";
  if (orderBy && orderBy.includes(":")) {
    const parts = orderBy.split(":");
    sortField = parts[0];
    sortDirection = parts[1] as Prisma.SortOrder;
  }

  return await prisma.products.findMany({
    where,
    orderBy: { [sortField]: sortDirection } as Record<string, Prisma.SortOrder>,
  });
};

export const createProductService = async (dataProduct: CreateProductData) => {
  const { product_code, product_name, unit, description } = dataProduct;
  return await prisma.products.create({
    data: {
      product_code,
      product_name,
      unit,
      description,
    },
  });
};

export const updateProductService = async (
  filters: ProductFilters,
  dataProduct: UpdateProductData,
) => {
  const { id } = filters;
  const { product_code, product_name, unit, description } = dataProduct;
  const data: Record<string, unknown> = {};
  if (product_code) data.product_code = product_code;
  if (product_name) data.product_name = product_name;
  if (unit) data.unit = unit;
  if (description) data.description = description;
  return await prisma.products.update({
    where: { id: Number(id) },
    data: data,
  });
};

export const deleteProductService = async (filters: ProductFilters) => {
  const { id } = filters;
  return await prisma.products.delete({
    where: { id: Number(id) },
  });
};

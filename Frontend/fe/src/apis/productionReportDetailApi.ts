import type { ProductReportDetailType } from "../types/ProductReportDetailType";
import instance from "./axios";

interface ProductionReportDetailForm {
  product_id: number | undefined;
  report_id: number | undefined;
  is_finish: string | undefined;
  type_of_specification: string | undefined;
  product_line: string | undefined;
  specification: string | undefined;
  start_time: string | undefined;
  end_time: string | undefined;
  weight: number | undefined;
  note: string | undefined;
}

const productionReportDetailApi = {
  getAllProductionReportDetail: (params?: unknown) => {
    return instance.get<ProductReportDetailType[]>(`/product-report-detail`, {
      params: params,
    });
  },
  createProductionReportDetail: (data: ProductionReportDetailForm) => {
    return instance.post<ProductReportDetailType[]>(
      `/product-report-detail`,
      data,
    );
  },
  updateProductionReportDetail: (
    id: number | string,
    data: ProductionReportDetailForm,
  ) => {
    return instance.patch<ProductReportDetailType[]>(
      `/product-report-detail/${id}`,
      data,
    );
  },
  deleteProductionReportDetailApi: (id: number | string) => {
    return instance.delete<ProductReportDetailType[]>(
      `/product-report-detail/${Number(id)}`,
    );
  },
};

export default productionReportDetailApi;

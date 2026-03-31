export interface ProductionLogDetailType {
  id: number;
  production_log_id: number;
  start_time: string;
  end_time: string;
  task_type: string;
  content: string;
  quantity: number;
  product_type: string;
  pkg_received: number;
  pkg_returned: number;
  pkg_damaged: number;
}

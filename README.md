# Mini ERP

Đây là ứng dụng được sử dụng trong nhà máy phân bón quy mô nhỏ, thay thế các bản ghi bằng giấy truyền thống sang hệ thống ERP nhỏ, hỗ trợ công việc thao tác dữ liệu trên máy tính, lưu dữ liệu dưới dạng số, dễ dàng quản lý, thống kê, báo cáo.

## Tính năng chính
- Thêm/Sửa/Xóa user/ingredients/product/reports...
- Thống kê

## Cài đặt
- Node.js v22.18.0
- Prisma v7.3.0

```bash
# Clone dự án
git clone 

# Cài đặt thư viện
npm install

# Chạy ứng dụng
# pckage.json 
#  "scripts": {
#     "dev": "nodemon --exec npx tsx server.js"
#  }
npm run dev

# Trong trường hợp DB chưa đồng bộ
npx prisma db pull
npx prisma generate
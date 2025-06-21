# Coding Conventions - Order App Frontend

## Ngôn ngữ và Localization

### 1. Ngôn ngữ chính
- **Tất cả nội dung hiển thị cho người dùng PHẢI bằng tiếng Việt**
- Không sử dụng tiếng Anh cho các text hiển thị trên UI
- Chỉ sử dụng tiếng Anh cho:
  - Tên biến, function, class
  - Comments trong code
  - API endpoints
  - Database field names

### 2. Quy tắc dịch thuật

#### Navigation & Menu
- Dashboard → Bảng điều khiển
- Products → Sản phẩm
- Orders → Đơn hàng
- Customers → Khách hàng
- Settings → Cài đặt
- Profile → Hồ sơ
- Logout → Đăng xuất
- Login → Đăng nhập

#### Common Actions
- Add → Thêm
- Edit → Chỉnh sửa
- Delete → Xóa
- Save → Lưu
- Cancel → Hủy
- Update → Cập nhật
- Create → Tạo mới
- Search → Tìm kiếm
- Filter → Lọc
- Export → Xuất
- Import → Nhập

#### Status & Messages
- Loading → Đang tải
- Success → Thành công
- Error → Lỗi
- Warning → Cảnh báo
- Information → Thông tin
- Confirmation → Xác nhận
- Please try again → Vui lòng thử lại
- Failed to → Không thể

#### Form Labels
- Name → Tên
- Price → Giá
- Quantity → Số lượng
- Description → Mô tả
- Category → Danh mục
- Status → Trạng thái
- Date → Ngày
- Time → Thời gian

### 3. Cấu trúc file và tổ chức

#### Naming Convention
- Components: PascalCase (VD: `ProductList.tsx`)
- Pages: kebab-case (VD: `product-management.tsx`)
- Utilities: camelCase (VD: `formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE (VD: `API_ENDPOINTS`)

#### File Organization
```
src/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx          # Shared layout với header
│   │   ├── dashboard/
│   │   └── products/
│   └── (auth)/
│       ├── login/
│       └── register/
├── components/
│   ├── ui/                     # Reusable UI components
│   └── forms/                  # Form components
├── lib/
│   ├── auth.ts
│   ├── products.ts
│   └── utils.ts
└── types/
    └── index.ts
```

### 4. Component Guidelines

#### Props Interface
```typescript
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}
```

#### Error Handling
```typescript
// ✅ Đúng - Sử dụng tiếng Việt cho error messages
setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");

// ❌ Sai - Không sử dụng tiếng Anh
setError("Failed to load products. Please try again.");
```

#### Loading States
```typescript
// ✅ Đúng
if (loading) {
  return <Typography>Đang tải sản phẩm...</Typography>;
}

// ❌ Sai
if (loading) {
  return <Typography>Loading products...</Typography>;
}
```

### 5. Accessibility

#### Alt Text
```typescript
// ✅ Đúng
<Image alt="Hình ảnh sản phẩm" src={product.image} />

// ❌ Sai
<Image alt="Product image" src={product.image} />
```

#### ARIA Labels
```typescript
// ✅ Đúng
<Button aria-label="Chỉnh sửa sản phẩm">Chỉnh sửa</Button>

// ❌ Sai
<Button aria-label="Edit product">Chỉnh sửa</Button>
```

### 6. Testing

#### Test Descriptions
```typescript
// ✅ Đúng
describe('Quản lý sản phẩm', () => {
  it('nên hiển thị danh sách sản phẩm', () => {
    // test logic
  });
});

// ❌ Sai
describe('Product Management', () => {
  it('should display product list', () => {
    // test logic
  });
});
```

### 7. Documentation

#### README và Comments
- Comments trong code có thể bằng tiếng Anh
- README files nên có cả tiếng Việt và tiếng Anh
- API documentation nên có ví dụ bằng tiếng Việt

### 8. Validation

#### Form Validation Messages
```typescript
const validationMessages = {
  required: 'Trường này là bắt buộc',
  email: 'Email không hợp lệ',
  minLength: 'Tối thiểu {min} ký tự',
  maxLength: 'Tối đa {max} ký tự',
  number: 'Vui lòng nhập số',
  positive: 'Vui lòng nhập số dương'
};
```

### 9. Date và Number Formatting

#### Vietnamese Locale
```typescript
// Date formatting
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('vi-VN').format(date);
};

// Number formatting
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
```

### 10. Review Checklist

Trước khi commit code, hãy kiểm tra:
- [ ] Tất cả text hiển thị đã được dịch sang tiếng Việt
- [ ] Error messages bằng tiếng Việt
- [ ] Loading states bằng tiếng Việt
- [ ] Button labels bằng tiếng Việt
- [ ] Form labels bằng tiếng Việt
- [ ] Table headers bằng tiếng Việt
- [ ] Tooltip text bằng tiếng Việt
- [ ] Dialog titles và content bằng tiếng Việt

---

**Lưu ý quan trọng**: Việc sử dụng tiếng Việt cho tất cả content là yêu cầu bắt buộc để phục vụ khách hàng Việt Nam. Hãy đảm bảo tuân thủ quy tắc này trong mọi component và page. 
export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <span className="empty-state__icon">404</span>
      <h2 className="empty-state__title">Không tìm thấy trang</h2>
      <p className="empty-state__desc">
        Trang bạn đang tìm không tồn tại.
      </p>
      <a href="/" className="error-state__retry" style={{ display: 'inline-block', marginTop: '16px', textDecoration: 'none' }}>
        Về trang chủ
      </a>
    </div>
  );
}

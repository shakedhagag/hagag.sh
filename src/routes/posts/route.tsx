import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/site-header';

export const Route = createFileRoute('/posts')({
  component: PostsLayout,
});

function PostsLayout() {
  return (
    <div className="content-grid py-12">
      <Header />
      <Outlet />
    </div>
  );
}

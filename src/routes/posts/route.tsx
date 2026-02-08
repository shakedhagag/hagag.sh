import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/site-header';

export const Route = createFileRoute('/posts')({
  component: PostsLayout,
});

function PostsLayout() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Header />
      <div className="[view-transition-name:main-content]">
        <Outlet />
      </div>
    </div>
  );
}

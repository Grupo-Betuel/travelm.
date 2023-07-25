import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  });
  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
}

import React, { useEffect } from 'react';
// import { useRouter } from 'next/router';

export default function NotFound() {
  // const router = useRouter();

  useEffect(() => {
    // router.replace('/');
  });

  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
}

export async function getStaticProps() {
  return {
    notFound: true, // triggers 404
  };
}

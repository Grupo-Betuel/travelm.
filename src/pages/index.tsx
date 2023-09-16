import { Home } from '@screens/Home';
import { GetServerSideProps } from 'next';

function Index() {
  return <Home />;
}

export async function getStaticProps(context: any) {
  console.log('app context', context);

  return {
    props: {
      protected: false,
    },
  };
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {} as any;
// };

export default Index;

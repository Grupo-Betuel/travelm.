import { Home } from '@screens/Home';

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

export default Index;

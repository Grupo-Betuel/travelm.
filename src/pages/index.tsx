import type { NextPage } from 'next'
import { Home } from '@screens/Home'

const Index: NextPage = () => {
  return <Home />
}

export async function getStaticProps() {
  return {
    props: {
      protected: false,
    },
  }
}

export default Index

import { useRouter } from 'next/router'
import { Banner } from '../index'
import url from '../../lib/url'
export default function Post(props) {
  console.log(props);
  return (
    <Banner />
  )
}

// export async function getStaticPaths() {
//   const response = await fetch('http://192.168.1.43:3000/api/post')
//   const data = await response.json();
//   const paths = data.map(post => { params: post.id })
//   return {
//     paths
//   }
// }
export async function getServerSideProps({ params: { id } }) {
  const response = await fetch(url + 'api/post?id=' + id);
  const data = await response.json();
  if (response.status === 200) {
    return {
      props: { post: data.payload }
    }
  }
  return { props: { post: [] } }
}
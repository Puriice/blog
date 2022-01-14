import Link from 'next/link'
import Head from 'next/head'
import url from '../lib/url';
import css from '../styles/index.module.css'
import banner from '../styles/banner.module.css'
import nav from '../styles/nav.module.css'
import postsCSS from '../styles/post.module.css'
import aside from '../styles/aside.module.css'
import nopost from '../styles/nopost.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitch, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faCopy, faSearch } from '@fortawesome/free-solid-svg-icons'
import { } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react'

function BannerPost({ post, imagePath }) {
  return (
    <div className={banner.post}>
      <div className={banner.image} style={{ '--image': imagePath }}></div>
      <div className={banner.content_wrapper}>
        <div className={banner.content}>
          <div className={banner.title}>{post.title}</div>
          <div className={banner.body + ' body'}>{post.describe}</div>
          {(post.id) ? (
            <Link href={`/post/${post.id}`}>
              <a className={banner.more_btn}>More</a>
            </Link>
          ) : ''}
        </div>
      </div>
    </div >
  )
}
function Post({ post }) {
  return (
    <div className={postsCSS.post}>
      <div className={postsCSS.image}></div>
      <div className={postsCSS.content_wrapper}>
        <div className={postsCSS.title}>{post.title}</div>
        <div className={postsCSS.describe + ' body'}>{post.describe}</div>
        <Link href={`/post/${post.id}`}>
          <a className={postsCSS.more_btn}>More</a>
        </Link>
      </div>
    </div>
  )
}
function SocialLink(props) {
  return (
    <Link href={props.href}>
      <a className={aside.link}>
        <FontAwesomeIcon className={aside.logo} icon={props.icon} />
        <div className={aside.hrefName}>{props.hrefName}</div>
      </a>
    </Link>
  )
}
export function Banner() {
  return (
    <div className={nav.wrapper}>
      <Link href="/">
        <a className={nav.logo}>
          Purinutt&apos;s Blog
        </a>
      </Link>
      <Link href="/">
        <a className={nav.portnav}>Portfolio</a>
      </Link>
    </div>
  )
}
export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [bannerPosts, setBannerPosts] = useState(props.bannerPosts)
  const age = Math.floor((Date.now() - Date.parse('08 April 2004') - 4 * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24 * 365))
  const welcomePost = {
    title: "Welcome to my blog.",
    describe: `Greeting everyone who come to my blog.  Let me introduce myself. <br>My name is Purinutt Amartayavis. I'm ${age} year old. <br>I am very pleased that you came to visit my blog. Enjoy the blog.`,
  }
  useEffect(() => {
    const navs = document.querySelectorAll('.carousel_nav > span')
    navs[0]?.classList.add('active')
    const bodys = document.querySelectorAll('.body')
    bodys.forEach(body => {
      body.innerHTML = body.textContent
    })
  }, [])
  let displayIndex = 0;
  function updateNav(index) {
    const navs = document.querySelectorAll('.carousel_nav > span')
    const activeNav = navs[index]

    const activedNav = document.querySelector('.active');
    activedNav.classList.remove('active');
    activeNav.classList.add('active')
  }

  function displayPost(index) {
    const posts = document.querySelectorAll('.slicer > div');
    if (index < 0) index = posts.length - 1;
    if (index > posts.length - 1) index = 0;
    const slicer = document.querySelector('.slicer')
    slicer.style.right = `${index * 100}%`
    updateNav(index)
    displayIndex = index;
  }
  function next() {
    displayPost(displayIndex + 1);
  }
  function prev() {
    displayPost(displayIndex - 1);
  }
  async function search(e) {
    e.preventDefault();
    const query = e.target.search.value;
    const response = await fetch(`/api/search?q=${query}`);
    const posts = await response.json();
    if (response.status === 200) {
      if (posts.length) setPosts(posts)
      else setPosts(404)
    }
  }
  return (
    <div>
      <Head>
        <title>Purinutt&apos;s Blog</title>
      </Head>
      <header>
        <Banner />
        <div className={banner.wrapper}>
          <div className={banner.carousel + ' carousel'}>
            <div className={banner.slicer + ' slicer'}>
              <BannerPost post={welcomePost} imagePath="#f00" />
              {(bannerPosts.length) ? bannerPosts.map((post, index) => <BannerPost post={post} imagePath={post.image} key={index * Math.round(Math.random() * Date.now())} />) : ''}
            </div>
          </div>
          {(bannerPosts.length) ? (
            <div className={banner.carousel_prev} onClick={prev}>&lt;</div>
          ) : ''}
          {(bannerPosts.length) ? (
            <div className={banner.carousel_next} onClick={next}>&gt;</div>
          ) : ''}
          <div className={banner.carousel_navigater + ' carousel_nav'}>
            {(bannerPosts.length) ? <span onClick={displayPost.bind(undefined, 0)} className={banner.carousel_btn}></span> : ''}
            {(bannerPosts.length) ? bannerPosts.map((post, index) => <span onClick={displayPost.bind(undefined, index + 1)} className={banner.carousel_btn} key={index * Math.round(Math.random() * Date.now())}></span>) : ''}
          </div>
        </div>
      </header>
      <div className={css.main}>
        <main className={postsCSS.wrapper}>
          {(posts.length) ? posts.map((post, index) => <Post post={post} key={index} />) : (posts === 404) ? (
            <div className={nopost.wrapper}>
              <div className={nopost.block}>
                <FontAwesomeIcon className={nopost.logo} icon={faSearch} />
                <div className={nopost.describe}>No result.</div>
              </div>
            </div>
          ) : (
            <div className={nopost.wrapper}>
              <div className={nopost.block}>
                <FontAwesomeIcon className={nopost.logo} icon={faCopy} />
                <div className={nopost.describe}>There are no posts at this time.</div>
              </div>
            </div>
          )}
        </main>
        <aside className={aside.wrapper}>
          <div className={aside.topic}>
            <div>
              Search
            </div>
          </div>
          <form className={aside.search} onSubmit={search}>
            <input type="text" name="search" className={aside.searchbar} />
            <button className={aside.search_btn} type="submit">Go</button>
          </form>
          <div className={aside.topic}>
            <div>
              My Social
            </div>
          </div>
          <SocialLink href="https://www.facebook.com/profile.php?id=100076766349624" icon={faFacebook} hrefName="Purinutt Amartayavis" />
          <SocialLink href="https://www.instagram.com/puricatt.r6/" icon={faInstagram} hrefName="puricatt.r6" />
          <SocialLink href="https://www.twitch.tv/puricatt" icon={faTwitch} hrefName="Puricatt" />
        </aside>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch(url + 'api/post')
  const data = await response.json();
  console.log(data);
  if (data.length) {
    const bannerPosts = await data.filter(post => post.isBanner)
    return {
      props: {
        bannerPosts,
        posts: data
      }
    }
  } else {
    return {
      props: {
        bannerPosts: [],
        posts: []
      }
    }
  }
}
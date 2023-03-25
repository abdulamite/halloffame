import client from "../../client";

type Props = {
  posts: any;
};

export const getStaticProps = async () => {
  const query = `*[_type == "post"] {
        slug,
    }
    `;
  const posts = await client.fetch(query);
  return {
    props: {
      posts,
    },
  };
};

export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    <>
      <main>
        <h1>Some content here for PR</h1>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug.current}>
              <a href={`/post/${post.slug.current}`}>{post.slug.current}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

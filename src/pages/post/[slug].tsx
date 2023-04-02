import { GetStaticProps, GetStaticPaths } from "next";
import imageURLBuilder from "@sanity/image-url";
import client from "../../../client";
import Image from "next/image";

type BlogPost = {
  banner: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  content: any;
  _createdAt: string;
  date: string;
  website: string;
  address: string;
};

type Block = {
  _type: string;
  children: any;
  asset: any;
};

type Props = {
  post: BlogPost;
};

const builder = imageURLBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params,
}) => {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _createdAt,
      title,
      description,
      banner,
      slug,
      tags,
      content,
      date,
      website,
      address,
    }
  `;
  const { slug } = params!;
  const post = await client.fetch<BlogPost>(query, { slug });
  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
        slug,
    }
    `;
  const posts = await client.fetch(query);
  const paths = posts.map((post: { slug: { current: any } }) => ({
    params: { slug: post.slug.current },
  }));
  return {
    paths,
    fallback: false,
  };
};

// convert date to human readable format like Friday, December 25, 2020
function convertDate(date: string) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options as any);
}

const renderBlock = (block: Block) => {
  switch (block._type) {
    case "block":
      return (
        <p className="max-w-800px font-serif text-lg leading-6 px-4 mb-2">
          {block.children.map((span: any) => span.text).join("")}
        </p>
      );
    case "image":
      return (
        <Image
          className="w-full h-300 bg-gray-800 object-cover"
          src={urlFor(block.asset._ref).url()}
          width={400}
          height={300}
          alt="inline-image"
        />
      );
    default:
      return null;
  }
};

const googleMapsPreviewImage = (locationAddress: string) => {
  const splitAddress = locationAddress.split(",");
  const address = splitAddress.join("+");
  return (
    <div className="h-40 relative">
      <Image
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&size=1200x1200&scale=2&maptype=roadmap&markers=color:red%7Clabel:A%7C${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        alt="Location Map"
        fill
        className="static object-cover"
      />
    </div>
  );
};

const aboutTheLocationCard = (post: BlogPost) => {
  const splitAddress = post.address.split(",");
  return (
    <div className="p-2 bg-slate-50">
      <h3 className="text-2xl font-bold mb-2">About this location:</h3>
      <div className="">
        {googleMapsPreviewImage(post.address)}
        <div className="my-2">
          <div className="mb-4">
            <span className="font-bold mr-1">Visited On:</span>
            <span className="">{convertDate(post.date)}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold mr-1">Address:</span>
            {splitAddress.map((address: string, index: number) => (
              <span className="" key={index}>
                {address}
              </span>
            ))}
          </div>
          <div className="">
            <span className="font-bold mr-1">Website:</span>
            <span className="">
              <a className="underline" href={post.website}>
                {post.website}
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const postTags = (tags: string[]) => {
  return (
    <ul className="flex flex-wrap justify-center my-6 w-full">
      {tags.map((tag) => (
        <li
          className="bg-gray-400 text-white hover:bg-gray-600 font-bold  py-1 px-4 text-sm mr-2 mb-2"
          key={tag}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
};

const Post = ({ post }: Props) => {
  console.log(post);
  return (
    <div>
      <div className="w-full h-200 bg-gray-800 object-cover m-h-50">
        <Image
          className="w-full max-h-80 bg-gray-800 object-cover"
          src={urlFor(post.banner).url()}
          alt="banner image"
          width={1200}
          height={200}
          priority
        />
      </div>
      <article className="max-w-5xl sm:w-11/12 mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">{post.title}</h1>
        <p className="text-center text-gray-500 mb-4">{post.description}</p>
        <div className="text-center text-gray-500 mb-4 italic">
          <span>{convertDate(post._createdAt)}</span>
        </div>

        <div className="text-gray-700">
          <div>{post.content.map((block: Block) => renderBlock(block))}</div>
        </div>
        {postTags(post.tags)}
        {post.address && post.website && post.date
          ? aboutTheLocationCard(post)
          : null}
      </article>
    </div>
  );
};

export default Post;

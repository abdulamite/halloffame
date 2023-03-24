import { GetStaticProps, GetStaticPaths } from "next";
import imageURLBuilder from "@sanity/image-url";
import client from "../../../client";
import Image from "next/image";
import styles from "./Slug.module.css";

type BlogPost = {
  banner: string;
  title: string;
  slug: string;
  body: string;
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
        <p>{block.children.map((span: { text: any }) => span.text).join("")}</p>
      );
    case "image":
      console.log(urlFor(block.asset._ref).width(400).url());
      return (
        <img
          className={styles.banner}
          src={urlFor(block.asset._ref).width(400).url()}
          alt="something"
        />
      );
    default:
      return null;
  }
};

const googleMapsPreviewImage = (post: BlogPost) => {
  const splitAddress = post.address.split(",");
  const address = splitAddress.join("+");
  return (
    <img
      className={styles.googleMapsPreviewImage}
      src={`https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=12&size=200x250&maptype=roadmap&markers=color:red%7Clabel:A%7C${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      alt="Location Map"
    />
  );
};

const aboutTheLocationCard = (post: BlogPost) => {
  const splitAddress = post.address.split(",");
  return (
    <div className={styles.aboutTheLocationCard}>
      <h3>About the Location</h3>
      <div className={styles.aboutTheLocationCardContent}>
        <div className={styles.aboutTheLocationCardMap}>
          {googleMapsPreviewImage(post)}
        </div>
        <div className="aboutTheLocationCardCardContentContainer">
          <div className={styles.aboutTheLocationCardVisitedAtContianer}>
            <span className={styles.aboutTheLocationCardVisitedAtLabel}>
              Visited On
            </span>
            <span className={styles.aboutTheLocationCardVisitedAt}>
              {convertDate(post.date)}
            </span>
          </div>
          <div className={styles.aboutTheLocationCardAddressContainer}>
            <span className={styles.aboutTheLocationCardAddressLabel}>
              Address
            </span>
            {splitAddress.map((address, index) => (
              <span className={styles.aboutTheLocationCardAddress} key={index}>
                {address}
              </span>
            ))}
          </div>
          <div className={styles.aboutTheLocationCardWebsiteContainer}>
            <span className={styles.aboutTheLocationCardWebsiteLabel}>
              Website
            </span>
            <span className={styles.aboutTheLocationCardWebsite}>
              <a href={post.website}>{post.website}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = ({ post }: Props) => {
  console.log(post);
  return (
    <div>
      <div className={styles.bannerContainer}>
        <img className={styles.banner} src={urlFor(post.banner).url()} alt="" />
      </div>
      <article className={styles.postContentContainer}>
        <h2 className={styles.blogPostTitle}>{post.title}</h2>
        <div className={styles.postDate}>
          <span>{convertDate(post._createdAt)}</span>
        </div>
        <ul className={styles.postTagChipsContainer}>
          {post.tags.map((tag) => (
            <li className={styles.postTagChips} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
        <div className={styles.postContent}>
          <div>{post.body}</div>
          <div>{post.content.map(renderBlock)}</div>
        </div>
        {post.website && post.address && post.date
          ? aboutTheLocationCard(post)
          : null}
      </article>
    </div>
  );
};

export default Blog;

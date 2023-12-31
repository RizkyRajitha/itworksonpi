export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    // console.log(req.body);
    // check model type is post
    if (req.body.model !== "post") {
      console.log(`not a post recived type : ${req.body.model}`);
      return res.json({ revalidated: false });
    }

    console.log(`revalidate : ${req.body.entry.slug}`);
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate(`/post/${req.body.entry.slug}`);
    // update index 
    await res.revalidate(`/`);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}

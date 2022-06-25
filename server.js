/*
    Copyright (C) 2021-2022 POKETUBE (https://github.com/iamashley0/poketube)
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/.
  */
const path = require("path");
const htmlParser = require("node-html-parser");
const moment = require("moment");
const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);
var express = require("express");
var app = express();
app.engine("html", require("ejs").renderFile);
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var dislike_api = `https://returnyoutubedislikeapi.com/votes?videoId=`
app.set("view engine", "html");
const lyricsFinder = require("./src/lyrics.js");
const renderTemplate = async (res, req, template, data = {}) => {
  res.render(
    path.resolve(`${templateDir}${path.sep}${template}`),
    Object.assign(data)
  );
};
const random_words = [
  "banana pie",
  "how to buy an atom bomb",
  "is love just an illusion",
  "things to do if ur face becomes benjamin frenklin",
  "how do defeat an pasta",
  "can you go to space?",
  "how to become a god?",
  "is a panda a panda if pandas???",
  "Minecraft moive trailer"
]
const image_urls = [
 "https://cdn.glitch.com/4095e32f-375a-40f2-841e-961cee4c2a95/sheng-l-q2dUSl9S4Xg-unsplash.jpg?v=1655990895950",
  "https://cdn.glitch.com/4095e32f-375a-40f2-841e-961cee4c2a95/willian-justen-de-vasconcellos-T_Qe4QlMIvQ-unsplash(1).jpg?v=1655991004992",
  "https://cdn.glitch.global/4095e32f-375a-40f2-841e-961cee4c2a95/s-b-vonlanthen-A8iLzX6OddM-unsplash.jpg?v=1655991148325",
  "https://cdn.glitch.global/4095e32f-375a-40f2-841e-961cee4c2a95/pawel-czerwinski-8uZPynIu-rQ-unsplash.jpg?v=1655991178735",
  "https://cdn.glitch.global/4095e32f-375a-40f2-841e-961cee4c2a95/richard-horvath-_nWaeTF6qo0-unsplash.jpg?v=1655991315976",
  "https://cdn.glitch.global/4095e32f-375a-40f2-841e-961cee4c2a95/john-fowler-aaIN3y2zcMQ-unsplash.jpg?v=1655991319840",
  "https://cdn.glitch.global/4095e32f-375a-40f2-841e-961cee4c2a95/kristopher-roller-zepnJQycr4U-unsplash.jpg?v=1655991322758"
]
const fetch = require("node-fetch");
const fetcher = require("./src/fetcher.js");

app.get("/watch", async function (req, res) {
  var v = req.query.v;
  const getColors = require('get-image-colors')
  var e = req.query.e;
  var r = req.query.r;

  const { toJson } = require("xml2json");
  const video = await fetch( `https://tube.kuylar.dev/api/video?v=${v}`);
  const h = await video.text();
  const k = JSON.parse(toJson(h));
  if(!v) res.redirect("/")
  var fetching = await fetcher(v)
     const j = fetching.video.Player.Formats.Format,
  j_ = Array.isArray(j)
    ? j[j.length - 1]
    : j;
let url;
if (j_.URL != undefined)
  url = j_.URL;
  const json = fetching.video.Player
   const engagement = fetching.engagement
   const lyrics = await lyricsFinder(json.Title);
  if (lyrics == undefined) lyrics = "Lyrics not found";
  renderTemplate(res, req, "poketube.ejs", {
    url: url,
    color: await getColors(`https://i.ytimg.com/vi/${v}/maxresdefault.jpg`).then((colors) => colors[0].hex()),
    engagement:engagement,
    video: json,
    date: moment(k.Video.uploadDate).format("LL"),
    e:e,
    k:k,
    r:r,
    lyrics: lyrics.replace(/\n/g, " <br> "),
  });
});

app.get("/old/watch", async function (req, res) {
  var v = req.query.v;
  const getColors = require('get-image-colors')
   var e = req.query.e;
  if(!v) res.redirect("/")
  var fetching = await fetcher(v)
    const j = fetching.video.Player.Formats.Format,
  j_ = Array.isArray(j)
    ? j[j.length - 1]
    : j;
let url;
if (j_.URL != undefined)
  url = j_.URL;
  const json = fetching.video.Player
   const engagement = fetching.engagement
   const lyrics = await lyricsFinder(json.Title);
  if (lyrics == undefined) lyrics = "Lyrics not found";
  renderTemplate(res, req, "poketube-old.ejs", {
    url: url,
    color: await getColors(`https://i.ytimg.com/vi/${v}/maxresdefault.jpg`).then((colors) => colors[0].hex()),
    engagement:engagement,
    video: json,
    date: moment(json.uploadDate).format("LL"),
    e:e,
    lyrics: lyrics.replace(/\n/g, " <br> "),
  });
});
app.get("/", function (req, res) {
  const things = random_words[Math.floor((Math.random()*random_words.length))];
    const ur = image_urls[Math.floor((Math.random()*image_urls.length))];

  renderTemplate(res, req, "main.ejs", {
  random:things,
  url:ur
});
});
app.get("/channel", async (req, res) => {
  const ID = req.query.id;
  const { toJson } = require("xml2json");
  const bout = await fetch( `https://tube.kuylar.dev/api/channel?id=${ID}&tab=about`);
  const h = await bout.text();
  const k = JSON.parse(toJson(h));
  const channel = await fetch( `https://tube.kuylar.dev/api/channel?id=${ID}&tab=videos`);
  const c = await channel.text();
  const tj = JSON.parse(toJson(c));
  const { Subscribers: subscribers } = k.Channel.Metadata;
  renderTemplate(res, req, "channel.ejs", {
  ID:ID,
  j:k,
  tj:tj,
  about:k.Channel.Contents.ItemSection.About,
  subs:typeof subscribers === 'string' ? subscribers.replace('subscribers', '') : 'Private',
  desc:k.Channel.Contents.ItemSection.About.Description
});});
app.get("/privacy", function (req, res) {
  renderTemplate(res, req, "priv.ejs");
});
app.get("/143", function (req, res) {
  renderTemplate(res, req, "143.ejs");
});
app.get("/domains", function (req, res) {
  renderTemplate(res, req, "domains.ejs");
});
app.get("/api/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.redirect("/");
  }
      return res.redirect(`/search?query=${query}`);
 });
app.get("/search", async (req, res) => {
  const { toJson } = require("xml2json");
  const query = req.query.query;
  const search = await fetch(`https://tube.kuylar.dev/api/search?query=${query}`);
  const text = await search.text();
  const j = JSON.parse(toJson(text));
  if (!query) {
    return res.redirect("/");
  }
  renderTemplate(res, req, "search.ejs", {
    j: j,
    q:query
  });
 });
app.get("/css/:id", (req, res) => {
  res.sendFile(__dirname + `/css/${req.params.id}`);
});
app.get("/js/:id", (req, res) => {
  res.sendFile(__dirname + `/js/${req.params.id}`);
});
app.get("/video/upload", (req, res) => {
           res.redirect("https://youtube.com/upload?from=poketube_utc");
 });
app.get("/api/video/download", async function (req, res) {
  var v = req.query.v;var fetching = await fetcher(v);const url = fetching.video.Player.Formats.Format[1].URL;res.redirect(url)
 });
app.get("/api/video/downloadjson", async function (req, res) {
  var v = req.query.v;var fetching = await fetcher(v);const url = fetching.video.Player.Formats.Format[1].URL;res.json(url)
 });


 app.get("*", function (req, res) {
const things = random_words[Math.floor((Math.random()*random_words.length))];
  renderTemplate(res, req, "404.ejs", {
  random:things,
});});
app.listen("3000", () => {
})

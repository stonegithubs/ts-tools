import Mongo from '../client';

new Mongo().getCollection('posts', 'posts').then(col => {
  col.find({}).toArray((err, docs) => {
    console.log(err, docs);
  })
});

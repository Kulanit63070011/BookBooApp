import * as tf from "@tensorflow/tfjs";

// ฟังก์ชันสร้างโมเดลแนะนำชุมชน
export const createRecommendationModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [1] }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
};

// ฟังก์ชันฝึกโมเดลและทำนายผลการแนะนำ
export const recommendCommunities = async (communityData, userInterests) => {
  const model = createRecommendationModel();
  const inputs = communityData.map((community) =>
    userInterests.some((interest) => community.type.includes(interest)) ? 1 : 0
  );
  const labels = communityData.map((community) =>
    userInterests.includes(community.type) ? 1 : 0
  );

  const xs = tf.tensor2d(inputs, [inputs.length, 1]);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 10 });

  const predictions = model.predict(xs).dataSync();

  // แสดงชื่อและคะแนนของชุมชนที่แนะนำในคอนโซล
  const recommendedCommunities = communityData
    .map((community, idx) => ({ ...community, score: predictions[idx] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // แสดงชื่อและคะแนนของชุมชนที่แนะนำ
  recommendedCommunities.forEach(community => {
    console.log(`Community: ${community.name}, Score: ${community.score}`);
  });

  return recommendedCommunities;
};

// ฟังก์ชันฝึกโมเดลและทำนายผลการแนะนำหนังสือ
export const recommendBooks = async (bookData, userInterests) => {
  const model = createRecommendationModel();
  const inputs = bookData.map((book) =>
    userInterests.some((interest) => book.category.includes(interest)) ? 1 : 0
  );
  const labels = bookData.map((book) =>
    userInterests.includes(book.category) ? 1 : 0
  );

  const xs = tf.tensor2d(inputs, [inputs.length, 1]);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 10 });

  const predictions = model.predict(xs).dataSync();

  // แสดงผลลัพธ์ในคอนโซล
  const recommendedBooks = bookData
    .map((book, idx) => ({ ...book, score: predictions[idx] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // แสดงชื่อและคะแนนของหนังสือที่แนะนำ
  recommendedBooks.forEach(book => {
    console.log(`Title: ${book.title}, Score: ${book.score}`);
  });

  return recommendedBooks;
};


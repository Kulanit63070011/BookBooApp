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
  console.log("Calculating community recommendations...");
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
  console.log("Community recommendation predictions:", predictions);

  const recommendedCommunities = communityData
    .map((community, idx) => ({ ...community, score: predictions[idx] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  recommendedCommunities.forEach(community => {
    console.log(`Community: ${community.name}, Score: ${community.score}`);
  });

  return recommendedCommunities;
};

// ฟังก์ชันฝึกโมเดลและทำนายผลการแนะนำหนังสือ
export const recommendBooks = async (bookData, userInterests) => {
  const model = createRecommendationModel();

  // ตรวจสอบว่า book.category และ userInterests มีข้อมูลก่อน
  const inputs = bookData.map((book) => {
    const bookCategories = book.category || []; // ตรวจสอบว่า category มีค่า
    return userInterests.some((interest) => bookCategories.includes(interest)) ? 1 : 0;
  });

  const labels = bookData.map((book) => {
    const bookCategories = book.category || []; // ตรวจสอบว่า category มีค่า
    return userInterests.includes(bookCategories) ? 1 : 0;
  });

  const xs = tf.tensor2d(inputs, [inputs.length, 1]);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 10 });

  const predictions = model.predict(xs).dataSync();

  // แสดงผลลัพธ์ในคอนโซล
  const recommendedBooks = bookData
    .map((book, idx) => ({ ...book, score: predictions[idx] }))
    .sort((a, b) => b.score - a.score);

  // แสดงชื่อและคะแนนของหนังสือที่แนะนำ
  recommendedBooks.forEach(book => {
    console.log(`Title: ${book.title}, Score: ${book.score}`);
  });

  return recommendedBooks;
};

export const createInterestVector = (userInterests, allPossibleInterests) => {
  if (!Array.isArray(userInterests) || userInterests.length === 0) {
    // คืนค่าเวกเตอร์เป็น 0 ถ้าความสนใจไม่ใช่อาเรย์หรือว่างเปล่า
    return new Array(allPossibleInterests.length).fill(0);
  }
  return allPossibleInterests.map(interest => userInterests.includes(interest) ? 1 : 0);
};

export const allPossibleInterests = [
  "General novels", "Romantic novels", "Fantasy novels", "Sci-fi novels", "Adventure novels",
  "Detective novels", "Horror novels", "Serial novels", "General cartoons", "Romantic cartoons",
  "Fantasy cartoons", "Sci-fi cartoons", "Adventure cartoons", "Detective cartoons", "Horror cartoons",
  "Serial cartoons", "Finance and Investment", "Market", "Psychology", "Self-Development",
  "Education", "Language", "Law", "Creative Design", "Politics", "Computer Science", "History",
  "Religious Beliefs", "Pets", "Health", "Travel", "Music and Entertainment", "Food", "Art", "Others"
];

export const findTopMatches = (currentUserInterests, allUsers, currentUserId, topN = 5) => {
  if (!Array.isArray(currentUserInterests) || currentUserInterests.length === 0) {
    return allUsers
      .filter(user => user.id !== currentUserId)
      .map(user => ({ userId: user.id, similarity: 0 }))
      .slice(0, topN);
  }

  const filteredUsers = allUsers.filter(user => user.id !== currentUserId);

  const similarityScores = filteredUsers.map((user) => {
    const userInterestsVector = createInterestVector(user.interests || [], allPossibleInterests);
    const currentUserVector = createInterestVector(currentUserInterests, allPossibleInterests);
    const similarity = cosineSimilarity(currentUserVector, userInterestsVector);
    return { userId: user.id, similarity };
  });

  return similarityScores
    .filter(score => score.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
};


// ส่งออกฟังก์ชัน cosineSimilarity
export const cosineSimilarity = (interests1, interests2) => {
  if (!Array.isArray(interests1) || !Array.isArray(interests2)) {
    console.error("Invalid inputs for cosineSimilarity:", interests1, interests2);
    return 0;
  }

  if (interests1.length === 0 || interests2.length === 0) {
    console.error("One or both interest vectors are empty:", interests1, interests2);
    return 0;
  }

  const vectorA = tf.tensor(interests1);
  const vectorB = tf.tensor(interests2);
  const dotProduct = tf.sum(tf.mul(vectorA, vectorB));
  const normA = tf.sqrt(tf.sum(tf.square(vectorA)));
  const normB = tf.sqrt(tf.sum(tf.square(vectorB)));

  if (normA.dataSync()[0] === 0 || normB.dataSync()[0] === 0) {
    return 0; // หาก norm ของเวกเตอร์ใดเป็น 0
  }

  const similarity = dotProduct.div(normA.mul(normB)).dataSync();
  return similarity[0];
};

// ส่งออกฟังก์ชัน rankCommunities
// ฟังก์ชัน rankCommunities ที่ถูกแก้ไข
// Update rankCommunities to include description and imageCommu
export const rankCommunities = (topUserIds, communityData) => {
  console.log("Ranking communities based on user interests...");
  const communityScores = communityData.map(community => {
    const score = topUserIds.filter(userId => community.members.includes(userId)).length;
    console.log(`Community: ${community.name}, Score: ${score}`);
    return { ...community, score };
  });

  return communityScores
    .sort((a, b) => b.score - a.score)
    .map(community => ({
      ...community,
      name: community.name,
      description: community.description || 'No description available',
      imageCommu: community.imageCommu || '',
      score: community.score,
    }));
};


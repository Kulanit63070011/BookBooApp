import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";

// ฟังก์ชันสำหรับแนะนำหนังสือ
const recommendBooks = (bookData, userInterests) => {
  // กรองหนังสือตามหมวดหมู่ที่ผู้ใช้สนใจ
  const recommendedBooks = bookData.filter((book) => 
    userInterests.includes(book.category)
  );
  return recommendedBooks;
};

// ดึงข้อมูลความสนใจของผู้ใช้
export const fetchUserInterests = (setUserInterests) => {
  const user = auth.currentUser;
  if (user) {
    const communitiesRef = collection(db, "communities");
    const unsubscribe = onSnapshot(communitiesRef, (snapshot) => {
      const communityData = snapshot.docs
        .filter((doc) => doc.data().members.includes(user.uid))
        .map((doc) => doc.data().type);
      setUserInterests(communityData);
      fetchRecommendedBooks(communityData);
    });
    return unsubscribe;
  }
};

// ดึงข้อมูลชุมชนทั้งหมด
export const fetchCommunityData = (setCommunityData, setError) => {
  const communitiesRef = collection(db, "communities");
  const unsubscribe = onSnapshot(
    communitiesRef,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCommunityData(data);
    },
    (error) => {
      setError("Failed to fetch community data");
    }
  );
};

export const fetchRecommendedBooks = async (userInterests) => {
  // ดึงข้อมูลหนังสือจาก Firestore หรือแหล่งข้อมูลอื่น ๆ ที่คุณใช้งาน
  const bookData = await getBooksFromFirestore(); // ฟังก์ชันนี้จะต้องสร้างขึ้นเพื่อดึงข้อมูลหนังสือ
  const recommendedBooks = recommendBooks(bookData, userInterests); // เรียกใช้ recommendBooks
  // คุณสามารถทำอะไรกับ recommendedBooks ที่นี่ เช่น อัปเดตสถานะในคอมโพเนนต์
  console.log(recommendedBooks); // ตัวอย่างการแสดงผลใน console
};

// ฟังก์ชันตัวอย่างสำหรับดึงข้อมูลหนังสือจาก Firestore
const getBooksFromFirestore = async () => {
  const booksRef = collection(db, "sharedBooks"); // ใช้ชื่อคอลเล็กชันที่ถูกต้อง
  const bookDocs = await getDocs(booksRef);
  return bookDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
import { collection, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// ฟังก์ชันสำหรับแนะนำหนังสือ
export const recommendBooks = (bookData, userInterests) => {
  // กรองหนังสือตามหมวดหมู่ที่ผู้ใช้สนใจ
  const recommendedBooks = bookData.filter((book) =>
    userInterests.includes(book.category)
  );
  return recommendedBooks;
};

// ดึงข้อมูลความสนใจของผู้ใช้
export const fetchUserInterests = async (setUserInterests) => {
  console.log("Fetching user interests...");
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userInterests = userDoc.data().interests;
        console.log("User interests:", userInterests);  // Log the fetched interests
        setUserInterests(userInterests);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user interests:", error);
    }
  }
};

// ดึงข้อมูลชุมชนทั้งหมด
export const fetchCommunityData = (setCommunityData, setError) => {
  console.log("Fetching community data...");
  const communitiesRef = collection(db, "communities");
  const unsubscribe = onSnapshot(
    communitiesRef,
    (snapshot) => {
      console.log("Community data snapshot received");
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCommunityData(data);
    },
    (error) => {
      console.error("Error fetching community data", error);
      setError("Failed to fetch community data");
    }
  );
  return unsubscribe;  // Returning unsubscribe to allow cleanup
};

// ฟังก์ชันสำหรับดึงข้อมูลหนังสือที่แนะนำ
export const fetchRecommendedBooks = async (userInterests) => {
  try {
    // ดึงข้อมูลหนังสือจาก Firestore หรือแหล่งข้อมูลอื่น ๆ ที่คุณใช้งาน
    const bookData = await getBooksFromFirestore(); // ฟังก์ชันนี้จะต้องสร้างขึ้นเพื่อดึงข้อมูลหนังสือ
    const recommendedBooks = recommendBooks(bookData, userInterests); // เรียกใช้ recommendBooks
    // คุณสามารถทำอะไรกับ recommendedBooks ที่นี่ เช่น อัปเดตสถานะในคอมโพเนนต์
    console.log(recommendedBooks); // ตัวอย่างการแสดงผลใน console
  } catch (error) {
    console.error("Error fetching recommended books:", error);
  }
};

// ฟังก์ชันตัวอย่างสำหรับดึงข้อมูลหนังสือจาก Firestore
export const getBooksFromFirestore = async () => {
  try {
    const booksRef = collection(db, "sharedBooks"); // ใช้ชื่อคอลเล็กชันที่ถูกต้อง
    const bookDocs = await getDocs(booksRef);
    return bookDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching books from Firestore:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// กรองผู้ใช้ในช่วงอายุที่ต้องการ
export const filterUsersByAgeRange = (users, targetAge) => {
  return users.filter((user) => {
    const age = calculateAge(user.birthDate);
    console.log(`Filtering User ID: ${user.id}, Age: ${age}`);
    return age >= targetAge - 1 && age <= targetAge + 1;
  });
};


// ดึงข้อมูลผู้ใช้ปัจจุบัน
export const getCurrentUserData = async () => {
  try {
    const currentUser = auth.currentUser; // Use auth.currentUser
    console.log(currentUser)
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid); // Correct way to reference the user document
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : null;
      if (userData) {
        // ส่ง userData พร้อมกับ userId
        return { ...userData, userId: currentUser.uid };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    return null;
  }
};
const firebaseApp = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const firebaseDB = require("firebase/database");
const app = require('./fire-base.js')
const jwt = require('jsonwebtoken');
 
firebaseDB.getDatabase(app)
const Key = "123456"
 
function createAccessToken(user) {
   return jwt.sign(user, Key, { expiresIn: '1d' });
}
 
function createRefreshToken(user) {
   return jwt.sign(user, Key, {
       expiresIn: '1d',
   });
}
 
async function addWithId(url, id, data) {
   /**
    * url: Đường dẫn tới thằng cha. VD: /BoardGames
    * id: id của board game cần update
    * boardGame: Đối tượng BoardGame chứa các field cần thay đổi
    * cb: Hàm nhận vào 1 tham số, chạy sau khi có kết quả trả về
    */
   try {
       data.id = id;
       data.password = null;
       const database = firebaseDB.getDatabase();
       await firebaseDB.set(firebaseDB.ref(database, `${url}/${id}`), data)
           console.log("Add successfully!")
   } catch(error) {
           console.log(error)
   }
}
 
module.exports = {
 
   signUp: async (email, password, data) => {
       const auth = firebaseAuth.getAuth();
       data.email = email;
       const userCredential = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
       const user = userCredential.user;
       await addWithId("/Users", user.uid, data)
       const accessToken = createAccessToken({ id: user.uid });
       const refreshToken = createRefreshToken({ id: user.uid });
       return {accessToken, refreshToken}
   },
 
   signIn: async (email, password) => {
       const auth = firebaseAuth.getAuth();
       const userCredential = await firebaseAuth.signInWithEmailAndPassword(auth, email, password)
       const user = userCredential.user;
       return user.uid;
   },  
 
   signOut: async () => {
       try {
           const auth = firebaseAuth.getAuth();
           await firebaseAuth.signOut(auth)
       }
       catch(error) {
           console.log(error);
       };
   },
 
   getCurrentUser: () => {
       const auth = firebaseAuth.getAuth();
       const user = auth.currentUser;
       if (user) {
           // User is signed in
           console.log(user);
       } else {
           // No user is signed in.
           console.log("No user is signed in");
       }
   },
 
   updatePassword: async (newPassword) => {
       try {
           const auth = firebaseAuth.getAuth();
           const user = auth.currentUser;
       
           await firebaseAuth.updatePassword(user, newPassword)
           console.log("Update successfully!");
       }
       catch(error) {
           // An error ocurred
           console.log(error);
       };
   
   },
 
   forgotPassword: async (email) => {
           const auth = firebaseAuth.getAuth();
           await firebaseAuth.sendPasswordResetEmail(auth, email)

   },   
  
  getById: async (url, id) => {
      /**
       * @param url: Đường dẫn tới thằng cha. VD: "/BoardGames"
       * @param id: id của board game cần xóa
       * @param cb: Hàm nhận vào 1 tham số, chạy sau khi có kết quả trả về.
       *            Nhận vào data nếu get thành công, Nếu data không có sẽ nhận vào "NO_DATA", object error nếu thất bại
       */
      const database = firebaseDB.getDatabase();
      const snapshot = await firebaseDB.get(firebaseDB.ref(database, `${url}/${id}`))
      if (snapshot.exists()) {
       return snapshot.val()
      } else {
       return "NO_DATA"
   }
  },
   getAll: async (url) => {
      /**
       * @param url: Đường dẫn tới thằng cha. VD: "/BoardGames"
       * @param id: id của board game cần xóa
       * @param cb: Hàm nhận vào 1 tham số, chạy sau khi có kết quả trả về.
       *            Nhận vào data nếu get thành công, Nếu data không có sẽ nhận vào "NO_DATA", object error nếu thất bại
       */
      const database = firebaseDB.getDatabase();
      const snapshot = await firebaseDB.get(firebaseDB.ref(database, `${url}`))
      if (snapshot.exists()) {
          return snapshot.val()
      } else {
          return "NO_DATA"
      }
  },
    add: async (url, data) => {
       try {
           const database = firebaseDB.getDatabase();
           const ref = firebaseDB.ref(database, `${url}`);
           const newKey = firebaseDB.push(ref).key;
           data.id = newKey;
            firebaseDB.set(firebaseDB.child(ref, newKey), data)
       } catch(error) {
           console.log("error", error)   
       }
   },
 
   filterByField: async (url, field, value) => {
       try {
           const database = firebaseDB.getDatabase();
           const ref = firebaseDB.query(firebaseDB.ref(database, url), firebaseDB.orderByChild(field), firebaseDB.equalTo(value));
           firebaseDB.onValue(ref,
               snapshot => {
                   const val = snapshot.val()
                   return Object.values(val != null ? val : {})
               },
               error => {
                   console.log(error);
           });
       } catch (error) {
           console.log("errorr", error)
       }
   },
 
   updateById: async (url, id, data) => {
      /**
       * url: Đường dẫn tới thằng cha. VD: /BoardGames
       * id: id của board game cần update
       * boardGame: Đối tượng BoardGame chứa các field cần thay đổi
       * cb: Hàm nhận vào 1 tham số, chạy sau khi có kết quả trả về
       */
       const database = firebaseDB.getDatabase();
       await firebaseDB.update(firebaseDB.ref(database, `${url}/${id}`), data)
  },
   deleteById: async (url, id) => {
      /**
       * @param url: Đường dẫn tới thằng cha. VD: /BoardGames
       * @param id: id của board game cần xóa
       * @param cb: Hàm nhận vào 1 tham số, chạy sau khi có kết quả trả về.
       *            Nhận vào "OK" nếu delete thành công, object error nếu thất bại
       */
       const database = firebaseDB.getDatabase();
       await firebaseDB.remove(firebaseDB.ref(database, `${url}/${id}`))
  }
}
 


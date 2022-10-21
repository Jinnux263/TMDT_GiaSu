const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const fs = require('fs');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

const app = require('../fire-base.js');
const {getStorage, ref, uploadBytesResumable, getDownloadURL} = require('firebase/storage')
const storage = getStorage();



cloudinary.config({
    cloud_name: "dz4xjrg9g",
    api_key: "155985213892545",
    api_secret: "Go7avqPvcj0Ws-ymrNFP_LZ7iXM",
});

router.post('/upload', auth, authAdmin, (req, res) => {
    // console.log("========upload file======",req);
    try {
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ err: 'Không tìm thấy ảnh' });
        }
        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            //size > (1md <==> 1024 * 1024)
            removeTmpfile(file.tempFilePath);
            return res
                .status(400)
                .json({ err: 'Kích thước hình ảnh quá lớn (< 1024 * 1024)' });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmpfile(file.tempFilePath);
            return res.status(400).json({ err: 'Định dạng file không hợp lệ' });
        }
        // Tải ảnh lên cloudinary
        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { folder: 'boardgames' },
            (err, result) => {
                if (err) throw err;
                removeTmpfile(file.tempFilePath);
                return res.json({
                    public_id: result.public_id,
                    url: result.url,
                });
            },
        );
        // console.log(file.name);
        
        // const uploadTask = storage.ref('games/${file.name}').put(file);
        // console.log("======tiep tuc nao2=====");
        // uploadTask.on(
        //     "state_changed",
        //     snapshot => {},
        //     error => {
        //         console.log("====error=====",error);
        //     },
        //     () => {
        //         storage 
        //             .ref("game")
        //             .child(file.name)
        //             .getDownloadURL()
        //             .then(url => {
        //                 console.log("=======url====",url);
        //             });
        //     }
        // )
    } catch (err) {
        removeTmpfile(file.tempFilePath);
        return res
            .status(500)
            .json({ err: err.messages, error: 'error at upload' });
    }
});

router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id)
            res.status(400).json({ err: 'Không có ảnh nào được chọn' });
        cloudinary.v2.uploader.destroy(public_id, (err) => {
            if (err) throw err;
            return res.json({ msg: 'Delete image false' });
        });
    } catch (err) {
        return res.status(500).json({ msg: 'Delete image false' });
    }
});

function removeTmpfile(path) {
    try {
        fs.unlink(path, (err) => {
            if (err) throw err;
        });
    } catch (err) {
        return res
            .status(500)
            .json({ err: err.messages, error: 'error at removeTmpfile' });
    }
}

module.exports = router;

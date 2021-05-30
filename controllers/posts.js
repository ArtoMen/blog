const db = require('../db/posts');
module.exports.create = async(req, res) => {
    if (!req.body.text || !req.file.path || !req.body.title) {
        res.status(400).json({ success: true, status: false, error: true, errorCode: 200, message: 'Some fields are empty' });
        return;
    }
    const result = await db.create(req.user, req.body.title, req.body.text, req.file.path);
    if (result) res.status(200).json({ success: true, status: true, error: false });
    else res.status(200).json({ success: true, status: true, error: false, errorCode: 500, message: 'Internal server error' });
}

module.exports.upload = (req, res) => {
    res.status(200).json({ success: true, status: true, error: false, filePath: req.file.path });
}

module.exports.like = async(req, res) => {
    if (req.params.id < 0) {
        res.status(400).json({ success: true, status: false, error: true, errorCode: 200, message: 'Some fields are empty' });
        return;
    }
    let result = await db.ifPost(req.params.id);
    if (result == -1) {
        res.status(200).json({ success: true, status: false, error: true, errorCode: 251, message: 'This post does not exist' });
        return;
    } else if (result == 0) {
        res.status(500).json({ success: true, status: false, error: true, errorCode: 500, message: 'Internal server error' });
        return;
    }
    result = await db.ifLike(req.user.id, req.params.id);
    if (result == 0) {
        res.status(500).json({ success: true, status: false, error: true, errorCode: 500, message: 'Internal server error' });
        return;
    } else if (result == -1) {
        result = await db.like(req.user.id, req.params.id);
        if (result == 0) res.status(500).json({ success: true, status: false, error: true, errorCode: 500, message: 'Internal server error' });
        else res.status(200).json({ success: true, status: true, error: false });
    } else {
        result = await db.removeLike(req.user.id, req.params.id);
        if (result == 0) res.status(500).json({ success: true, status: false, error: true, errorCode: 500, message: 'Internal server error' });
        else res.status(200).json({ success: true, status: true, error: false });
    }
}

module.exports.update = async(req, res) => {
    if (req.body.post_id < 0) {
        res.status(400).json({ success: true, status: false, error: true, errorCode: 200, message: 'Some fields are empty' });
        return;
    }
    let res = await db.ifPost(req.body.post_id);
    if (res == 0) {
        res.status(500).json({ success: true, status: false, error: true, errorCode: 500, message: 'Internal server error' });
        return;
    } else if (res == -1) {

    }
    const sets = {};
    if (req.body.title) sets.title = req.body.title;
    if (req.body.text) sets.text_post = req.body.text;
    if (req.body.file) sets.image = req.body.file;
    const result = await db.update(req.body.post_id, sets);
    // if (result) res.status(200).json({ success: true, status: true, error: false });
    // else res.status(200).json({ success: true, status: true, error: false, errorCode: 500, message: 'Internal server error' });
    res.status(200);
}
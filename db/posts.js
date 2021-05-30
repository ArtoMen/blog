const db = require('./db');
const moment = require('moment');

class Post extends db {
    async create(user_id, title, text, image) {
        try {
            const sql = 'INSERT INTO posts(user_id, title, text_post, date_create, date_update, image, update) VALUES($1, $2, $3, $4, $5, $6, false)';
            const time = moment().format('YYYY-MM-DD HH:mm:ss');
            const params = [user_id, title, text, time, time, image];
            await this.db.query(sql, params);
            return 1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async like(user_id, post_id) {
        try {
            await this.db.query('INSERT INTO likes(user_id, post_id) VALUES($1, $2)', [user_id, post_id]);
            return 1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async ifPost(post_id) {
        try {
            const res = await this.db.query('SELECT * from posts WHERE id = $1', [post_id]);
            if (res.rows.length) return 1;
            else return -1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async ifLike(user_id, post_id) {
        try {
            const res = await this.db.query('SELECT * from likes WHERE user_id = $1 and post_id = $2', [user_id, post_id]);
            if (res.rows.length) return 1;
            else return -1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async removeLike(user_id, post_id) {
        try {
            const res = await this.db.query('DELETE FROM likes WHERE user_id = $1 and post_id = $2', [user_id, post_id]);
            return 1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async update(post_id, options) {
        let sql = 'UPDATE posts SET ';
        const data = [post_id];
        options.update = true;
        options.date_update = moment().format('YYYY-MM-DD HH:mm:ss');
        for (let option in options) {
            data.push(options[option]);
            sql += `${option} = $${data.length}, `;
        }
        sql = sql.substr(0, sql.length - 2) + ' ';
        sql += 'where id = $1';
        try {
            await this.db.query(sql, data);
            return 1;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async getPost(id) {
        try {
            const post = await this.db.query('SELECT * FROM posts where id = $1', [id]);
            if (post.rows.length) return post;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}

module.exports = new Post();
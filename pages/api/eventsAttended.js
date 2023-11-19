
import pool from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { username } = req.query;
    const client = await pool.connect();
    try {
      
      const result = await client.query(
        'SELECT e."Event_ID", e."Name" FROM public."Event_Attended" ea JOIN public."Event" e ON ea."Event_ID" = e."Event_ID" WHERE ea."User_ID" = (SELECT "User_ID" FROM public."User" WHERE "Username" = $1)',
        [username]
      );

      const data = result.rows;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching events attended:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  } else {
    res.status(405).end();
  }
};

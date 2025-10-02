import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/db.json");

export async function GET() {
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Response.json(jsonData.scores);
}

export async function POST(request) {
  const body = await request.json();
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const { teamId, gameId, score } = body;

  const existing = jsonData.scores.find(
    (s) => s.teamId === teamId && s.gameId === gameId
  );

  if (existing) {
    existing.score = score;
  } else {
    jsonData.scores.push({ teamId, gameId, score });
  }

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  return Response.json({ teamId, gameId, score }, { status: 201 });
}
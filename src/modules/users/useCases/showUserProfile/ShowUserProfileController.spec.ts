import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Show user profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const id = uuidV4();
    const password = await hash("123", 8);
    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at, updated_at)
    VALUES('${id}', 'Goku', 'goku@gmail.com', '${password}', 'now', 'now')
    `
    );
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to show user's profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "goku@gmail.com",
      password: "123",
    });
    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Goku");
  });
  it("should not be able to show user's profile without authentication", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "Wrong email",
      password: "Wrong password",
    });
    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(401);
  });
});
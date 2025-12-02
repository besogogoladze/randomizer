// backend/controllers/namesController.js

import Names from "../models/names.js";
import crypto from "crypto";

const RANDOM_NAMES = [
  "Beso",
  "Mari",
  "Salome",
  "Giorgi",
  "Aleksandre",
  "SalomeKrw",
  "Nini",
  "Dato",
  "Luka",
];

// Secure key generator
const generateSecretKey = (length = 16) =>
  crypto.randomBytes(length).toString("hex").slice(0, length);

// Utility: case-insensitive match
const toLower = (str) => str.trim().toLowerCase();

export const createNamesDocument = async (req, res) => {
  try {
    const doc = await Names.create({ names: [] });
    return res.json(doc);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNames = async (req, res) => {
  try {
    const doc = await Names.findOne();
    return res.json(doc?.names || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const pickRandomName = async (req, res) => {
  try {
    const userName = req.body?.name;

    if (!userName || typeof userName !== "string") {
      return res.status(400).json({ message: "Name required" });
    }

    const loweredUser = toLower(userName);
    const loweredList = RANDOM_NAMES.map((n) => toLower(n));

    // Validate name is in allowed list
    if (!loweredList.includes(loweredUser)) {
      return res.status(400).json({
        message: "შეიყვანეთ სახელი სიიდან:",
        list: RANDOM_NAMES,
      });
    }

    // Ensure DB document exists
    let doc = await Names.findOne();
    if (!doc) {
      doc = await Names.create({ names: [] });
    }

    // Check if user already picked
    let existing = doc.names.find((n) => toLower(n.name) === loweredUser);

    if (existing?.chose && existing?.secretKey) {
      return res.json({
        message: `<strong>თქვენ აირჩიეთ: ${existing.chose}</strong>`,
        secretKey: `<strong>თქვენი კოდია: ${existing.secretKey}</strong>`,
      });
    }

    // Generate a unique random name (not used by others / not self)
    const usedChoices = new Set(
      doc.names.map((n) => toLower(n.chose)).filter(Boolean)
    );

    let randomChoice;
    const available = RANDOM_NAMES.filter(
      (n) => toLower(n) !== loweredUser && !usedChoices.has(toLower(n))
    );

    if (available.length === 0) {
      return res.status(400).json({ message: "No names available!" });
    }

    randomChoice = available[Math.floor(Math.random() * available.length)];

    const secretKey = generateSecretKey();

    // Update or push
    if (existing) {
      existing.chose = randomChoice;
      existing.secretKey = secretKey;
    } else {
      doc.names.push({
        name: userName,
        chose: randomChoice,
        secretKey,
      });
    }

    await doc.save();

    return res.json({
      message: `<strong>თქვენ აირჩიეთ: ${randomChoice}</strong>`,
      name: userName,
      chose: randomChoice,
      secretKey: `<strong>თქვენი კოდია: ${secretKey}</strong>`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

import Names from "../models/names.js";

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

export const createNamesDocument = async (req, res) => {
  try {
    const doc = await Names.create({});
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNames = async (req, res) => {
  try {
    const doc = await Names.findOne();
    if (!doc) return res.json([]);
    res.json(doc.names);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const pickRandomName = async (req, res) => {
  try {
    const userName = req.body.name;
    if (!userName) return res.status(400).json({ message: "Name required" });

    const lowerNames = RANDOM_NAMES.map((n) => n.toLowerCase());
    if (!lowerNames.includes(userName.toLowerCase())) {
      return res.status(400).json({
        message: "შეიყვანეთ სახელი სიიდან: ",
        list: RANDOM_NAMES,
      });
    }

    let doc = await Names.findOne();
    if (!doc) doc = await Names.create({});

    const existing = doc.names.find((n) => n.name === userName);
    if (existing && existing.chose) {
      return res.json({
        message: `<strong>თქვენ აირჩიეთ: ${existing.chose}</strong>`,
      });
    }

    let random;
    do {
      random = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    } while (
      doc.names.find((n) => n.chose === random) ||
      random.toLowerCase() === userName.toLowerCase()
    );

    const target = doc.names.find((n) => n.name === userName);
    if (target) target.chose = random;
    else doc.names.push({ name: userName, chose: random });

    await doc.save();

    res.json({
      message: `<strong>თქვენ აირჩიეთ: ${random}</strong>`,
      name: userName,
      chose: random,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

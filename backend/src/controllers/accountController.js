import { supabase } from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {
  const { id } = req.user;

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("id", id)
    .single();

  res.json(data);
};

export const getUsers = async (req, res) => {
  const { data } = await supabase.from("users").select("id,name,email");

  res.json(data);
};

export const transferMoney = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.body.receiverId;
  const amount = Number(req.body.amount); // FIX HERE

  const { data: sender } = await supabase
    .from("users")
    .select("*")
    .eq("id", senderId)
    .single();

  if (sender.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const { data: receiver } = await supabase
    .from("users")
    .select("*")
    .eq("id", receiverId)
    .single();

  const newSenderBalance = Number(sender.balance) - amount;
  const newReceiverBalance = Number(receiver.balance) + amount;

  await supabase
    .from("users")
    .update({ balance: newSenderBalance })
    .eq("id", senderId);

  await supabase
    .from("users")
    .update({ balance: newReceiverBalance })
    .eq("id", receiverId);

  await supabase.from("transactions").insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      transaction_type: "debit",
    },
    {
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      transaction_type: "credit",
    },
  ]);

  res.json({ message: "Transfer successful" });
};

export const getStatement = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

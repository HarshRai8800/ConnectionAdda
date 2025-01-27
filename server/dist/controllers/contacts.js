import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const searchContacts = async (req, res) => {
    try {
        const { searchTerms, email } = req.body;
        if (searchTerms === undefined || searchTerms === null) {
            return res.status(205).send("search Term is required");
        }
        const sanitizedSearchTerm = searchTerms
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        console.log(sanitizedSearchTerm);
        const regex = new RegExp(sanitizedSearchTerm, "i");
        const contacts = await prisma.userSchema.findMany({
            where: {
                AND: [
                    {
                        email: {
                            not: email
                        }
                    },
                    {
                        OR: [
                            {
                                email: {
                                    contains: sanitizedSearchTerm,
                                    mode: "insensitive"
                                }
                            },
                            {
                                firstname: {
                                    contains: sanitizedSearchTerm,
                                    mode: "insensitive",
                                },
                            },
                            {
                                lastname: {
                                    contains: sanitizedSearchTerm,
                                    mode: "insensitive",
                                },
                            }
                        ]
                    }
                ]
            }
        });
        console.log(contacts);
        return res.status(200).json({
            contacts
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "something went wrong at server"
        });
    }
};
const addContact = async (req, res) => {
    try {
        const { userEmail, contactEmail, userId } = req.body;
        if (!userEmail || !contactEmail) {
            return res.status(400).json({
                success: false,
                msg: "emails not found"
            });
        }
        const Contact = await prisma.userSchema.findUnique({
            where: {
                email: contactEmail
            }
        });
        if (!Contact) {
            return res.status(400).json({
                success: false,
                msg: "contact details sent is wrong ! not found"
            });
        }
        console.log(Contact);
        const checkContacts = await prisma.contact.findMany({
            where: {
                id: Contact.id,
                userId
            }
        });
        if (checkContacts.length > 0) {
            return res.status(400).json({
                success: false,
                msg: "contact cannot be added check the details again"
            });
        }
        const addedContact = await prisma.userSchema.update({
            where: {
                email: userEmail
            },
            data: {
                contacts: {
                    create: {
                        id: Contact.id,
                        email: Contact.email,
                        firstname: Contact.firstname,
                        lastname: Contact.lastname,
                        image: Contact.image || " ",
                        color: String(Contact.color)
                    }
                }
            }
        });
        if (!addContact) {
            return res.status(400).json({
                success: false,
                msg: "contact cannot be added check the details again"
            });
        }
        return res.status(200).json(Contact);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong at the server"
        });
    }
};
const findAllContacts = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const user = await prisma.userSchema.findUnique({
            where: {
                email
            }
        });
        const allContacts = await prisma.contact.findMany({
            where: {
                userId: user?.id
            }
        });
        if (!allContacts) {
            return res.status(400).json({
                success: false,
                msg: "contacts not found again"
            });
        }
        return res.status(200).json(allContacts);
    }
    catch (error) {
    }
};
const getContactsForChannel = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const user = await prisma.userSchema.findUnique({
            where: {
                email
            }
        });
        const allContacts = await prisma.contact.findMany({
            where: {
                userId: user?.id
            }
        });
        if (!allContacts) {
            return res.status(400).json({
                success: false,
                msg: "contacts not found again"
            });
        }
        const contacts = allContacts.map((contact) => ({
            label: contact.firstname ? `${contact.firstname} ${contact.lastname}` : contact.email,
            value: contact.index
        }));
        return res.status(200).json(contacts);
    }
    catch (error) {
    }
};
export { searchContacts, addContact, findAllContacts, getContactsForChannel };

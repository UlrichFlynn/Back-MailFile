const bcrypt = require('bcrypt');
const { generateLink } = require('../helper/utils');
const { emailService, fileService } = require('../services');
const shortUrl = require("node-url-shortener");
const fs = require('fs');
const http = require('http');

exports.uploadFile = async (req, res) => {
    try {
        let files = req.files;
        let filesLength = files.length;
        if (filesLength == 0) {
            return res.status(400).json({
                type: "error",
                message: "Please choose a file to send"
            });
        }
        req.body.userId = req.user._id;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        else {
            delete req.body.password;
        }

        const newUpload = await fileService.create(req.body);
        if (!newUpload) {
            return res.status(500).json({
                type: "error",
                message: "Echec dans la sauvearde des fichiers"
            });
        }

        files = files.map((file) => {
            let path = file.destination.split('public')[1] + '/' + file.filename;
            let link = `http://localhost:7020/api/files/download?id=${newUpload._id}&path=${path}`;
            let data = {
                name: file.originalname,
                path,
                link
            }
            return data;
        });

        await fileService.update(newUpload._id, { files });
        
        files = files.map(file => {
            return `${file.name}<br><a href="${file.link}" download="${file.name}">${file.link}</a><br>`;   
        });

        let description = `<b>On vous a envoyer quelques fichiers</b><br><hr><br>Avec le message suivant:<br>${req.body.message}<br>Fichiers envoyer:<br>${files}<br><hr>`;
        let emailData = {
            to: req.body.recipient,
            subject: `File notification from ${req.user.email}`,
            description
        }
        await emailService.sendLink(emailData);

        let descriptionToSender = `<b>Vous avez téléverser vos fichiers avec succès</b><br><hr><br>Vos fichiers ont été envoyé à l'adresse suivante:<br>${req.body.recipient}<br>Avec le message:<br>${req.body.message}<br>Les fichiers envoyé sont les suivants:<br>${files}<br><hr>`;
        let emailToSenderData = {
            to: req.user.email,
            subject: `Vous avez envoyé ${filesLength} fichhiers avec succès`,
            description: descriptionToSender
        }
        await emailService.sendLink(emailToSenderData);

        return res.status(200).json({
            type: "success",
            message: "Vos fichiers ont été envoyé"
        });
    }
    catch(error) {
        return res.status(500).json({
            type: "error",
            message: "Une erreur s'est produite",
            error: error.stack
        });
    }
}

exports.downloadFile = async (req, res) => {
    try {
        let { id, path, password } = req.body;
        let data = await fileService.getById(id);
        if (!data) {
            return res.status(404).json({
                type:"error",
                message: "Fichier introuvable"
            });
        }
        if (data.password) {
            if (!password) {
                return res.status(400).json({
                    type: "error",
                    message: "Un mot de passe est requis pour télécharger ce fichier"
                });
            }
            const validPassword = await bcrypt.compare(password, data.password);
            if (!validPassword) {
                return res.status(400).json({
                    type: "error",
                    message: "Mot de passe incorrect"
                });
            }
        }
        let file = data.files.find(x => x.path.toString() === path.toString());
  
        http.get(`http://localhost:7020/api${path}`, (response) => {
            // Image will be stored at this path
            const storagePath = __dirname.split('/Documents')[0] + `/Downloads/${file.name}`;
            const filePath = fs.createWriteStream(storagePath);
            response.pipe(filePath);
            filePath.on('finish',() => {
                filePath.close();
                console.log('Download Completed'); 
                return res.status(200).json({
                    type: "success",
                    message: "Téléchargement réussi"
                });
            });
        });

    }
    catch(error) {
        return res.status(500).json({
            type: "error",
            message: "Une erreur s'est produite",
            error: error.stack
        });   
    }
}
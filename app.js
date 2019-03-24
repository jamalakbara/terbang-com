const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const flash = require('connect-flash')

const app = express()

mongoose.connect('mongodb://localhost:27017/terbangCom', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('ERROR!!!!');
    } else {
        console.log('CONNECTED TO MONGODB');
    }
});

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: '123'
    },
    nama: String,
    noKtp: Number,
    jk: String,
    noTlp: Number,
    alamat: String
})
const penerbanganSchema = mongoose.Schema({
    asal: String,
    destinasi: String,
    wktBerangkat: {
        type: Date,
        default: Date.now
    },
    wktDatang: {
        type: Date
    },
    kelas: String,
    hrgOld: Number,
    hrgCil: Number,
    maskapai: String,
    image: String
})
const pesanSchema = mongoose.Schema({
    idPenerbangan: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    noTlp: {
        type: Number,
        required: true
    },
    totHarga: {
        type: Number,
        default: 0
    }
})

const Penerbangan = mongoose.model('Penerbangan', penerbanganSchema)
const Account = mongoose.model('Account', accountSchema)
const Pesan = mongoose.model('Pesan', pesanSchema)

// Account.findOneAndUpdate({email : 'admin@admin.com'},{$set : {nama : 'admin'}},(err)=>{
//     if (err) {
//         console.log('err');
        
//     } else {
//         console.log('berhasil');
        
//     }
// })

app.use(bodyParser.urlencoded({ extended: true }));
app.set(bodyParser.json())
app.set('view engine', 'ejs')
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'PENGKY',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('/', (req, res) => {
    console.log(session.loggedin);
    console.log(session.nama);

    if (session.loggedin) {
        Penerbangan.find().limit(4).exec((err, result) => {
            if (err) {
                console.log('ERROR!');
            } else {
                console.log('SUCCESS');
                res.render('index-logged-in', { data: result, nama: session.nama, id: session.sId })
            }
        })
    } else {
        Penerbangan.find().limit(4).exec((err, result) => {
            if (err) {
                console.log('ERROR!');
            } else {
                console.log('SUCCESS');
                res.render('index', { data: result })
            }
        })
    }
})

app.post('/login', (req, res) => {
    const email = req.body.emailLog
    const password = req.body.passwordLog
    const item = {
        email: email,
        password: password
    }
    Account.findOne({ email: email }).exec((err, result) => {
        if (err) {
            res.redirect('/')
        } else {
            console.log(result.email);
            if (result.email == email && result.password == password) {
                session.loggedin = true
                session.nama = result.nama
                session.sId = result.id
                if (result.email == 'admin@admin.com' && result.password == 'admin') {
                    res.redirect('/profile-admin/' + result.id)
                } else {
                    res.redirect('/profile/' + result.id)
                }
            } else {
                res.redirect('/')
            }
        }
    })

})

app.get('/profile/:id', (req, res) => {
    const id = req.params.id
    Account.findById({ _id: id }).exec((err, result) => {
        if (err) {
            res.redirect('/')
        } else {
            // session = req.session
            console.log(session.loggedin);

            if (session.loggedin) {
                Pesan.find({ email: result.email }).exec((err, data) => {
                    if (err) {
                        console.log(err);

                    } else {
                        res.render('profile', {
                            tiket: data,
                            nama: result.nama,
                            password: result.password,
                            email: result.email,
                            id: result.id,
                            noKtp: result.noKtp,
                            jk: result.jk,
                            alamat: result.alamat,
                            noTlp: result.noTlp
                        })
                    }
                })
            } else {
                res.redirect('/')
            }
        }
    })

})

app.get('/profile-admin/:id', (req, res) => {
    const id = req.params.id
    Account.findById({ _id: id }).exec((err, result) => {
        if (err) {
            res.redirect('/')
        } else {
            // session = req.session
            console.log(session.loggedin);
            if (session.loggedin) {
                Pesan.find().exec((err, data) => {
                    if (err) {
                        console.log(err);

                    } else {
                        res.render('profile-admin', {
                            tiket: data,
                            nama: result.nama,
                            email: result.email,
                            id: result.id
                        })
                    }
                })
            } else {
                res.redirect('/')
            }
        }
    })

})

app.post('/changePassword/:id', (req, res) => {
    const id = req.params.id
    Account.findById({_id: id}).exec((err,result)=>{
        if (err) {
            console.log('ERROR');
            
        } else {
            if (result.password == req.body.oldPass) {
                Account.findOneAndUpdate({ _id: id }, { $set: {password : req.body.newPass} }, (err) => {
                    if (err) {
                        console.log('ERROR!!!');
                    } else {
                        res.redirect('/profile/' + id)
                    }
                })
            } else {
                res.redirect('/profile/' + id)
            }
        }
    })
})

app.post('/edit/:id', (req, res) => {
    const id = req.params.id
    const items = {
        nama: req.body.nama,
        noKtp: req.body.identitas,
        jk: req.body.jk,
        noTlp: req.body.tlp,
        alamat: req.body.alamat
    }
    Account.findOneAndUpdate({ _id: id }, { $set: items }, (err) => {
        if (err) {
            console.log('ERROR!!!');
        } else {
            res.redirect('/profile/' + id)
        }
    })
})

app.post('/regis', (req, res) => {
    const items = {
        nama: req.body.nama,
        email: req.body.emailReg,
        password: req.body.passwordReg
    }

    Account.create(items, (err, result) => {
        if (err) {
            console.log('ERROR!');
        } else {
            res.redirect('/')
        }
    })
})

app.get('/about-us', (req, res) => {
    if (session.loggedin) {
        res.render('about-us-logged-in', { nama: session.nama, id: session.sId })
    } else {
        res.render('about-us')
    }
})

app.get('/booking/:id/:harga', (req, res) => {
    const id = req.params.id
    const harga = req.params.harga
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    if (session.loggedin) {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                Account.findById({ _id: session.sId }).exec((err, data) => {
                    if (err) {
                        console.log('ERROR');
                    } else {
                        res.render('booking-logged-in', {
                            data: result,
                            days: days,
                            months: months,
                            nama: session.nama,
                            id: session.sId,
                            noTlp: data.noTlp,
                            email: data.email,
                            harga : harga
                        })
                    }
                })
            }
        })
    } else {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                res.render('booking', {
                    data: result,
                    days: days,
                    months: months,
                    harga : harga
                })
            }
        })
    }
})

app.get('/offers', (req, res) => {
    const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    if (session.loggedin) {
        Penerbangan.find().limit(5).exec((err, result) => {
            if (err) {
                console.log('ERROR!');

            } else {
                console.log('SUCCESS');
                res.render('offers-logged-in', { data: result, hours: hours, minutes: minutes, nama: session.nama, id: session.sId })
            }
        })
    } else {
        Penerbangan.find().limit(5).exec((err, result) => {
            if (err) {
                console.log('ERROR!');

            } else {
                console.log('SUCCESS');
                res.render('offers', { data: result, hours: hours, minutes: minutes })
            }
        })
    }
})

app.post('/payment/:idFlight/:harga', (req, res) => {
    const items = {
        nama: req.body.nama,
        noTlp: req.body.hp,
        email: req.body.email,
        idPenerbangan: req.params.idFlight,
        totHarga: req.params.harga
    }
    Pesan.create(items)
    Account.create({nama: req.body.nama, email: req.body.email})
    res.redirect('/payments')
})

app.get('/payments', (req, res) => {
    if (session.loggedin) {
        Pesan.find().sort({ _id: -1 }).limit(1).exec((err, result) => {
            if (err) {
                console.log('error');
            } else {
                console.log(result[0].nama);
                Penerbangan.findById({ _id: result[0].idPenerbangan }, (err, data) => {
                    if (err) {
                        console.log('ERROR!!');
                    } else {
                        console.log(data);
                        res.render('payment-logged-in', {
                            dataTerbang: data,
                            noPesanan: result[0].id,
                            nama: result[0].nama,
                            totHarga: result[0].totHarga,
                            id: session.sId
                        })
                    }
                })
            }
        })
    } else {
        Pesan.find().sort({ _id: -1 }).limit(1).exec((err, result) => {
            if (err) {
                console.log('error');
            } else {
                console.log(result[0].nama);
                Penerbangan.findById({ _id: result[0].idPenerbangan }, (err, data) => {
                    if (err) {
                        console.log('ERROR!!');
                    } else {
                        console.log(data);
                        res.render('payment', {
                            dataTerbang: data,
                            noPesanan: result[0].id,
                            nama: result[0].nama,
                            totHarga: result[0].totHarga
                        })
                    }
                })
            }
        })
    }
})

app.get('/prebooking/:id', (req, res) => {
    const id = req.params.id
    const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    if (session.loggedin) {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                res.render('prebooking-logged-in', {
                    data: result,
                    hours: hours,
                    minutes: minutes,
                    days: days,
                    months: months,
                    nama: session.nama,
                    id: session.sId,
                    jumDewasa : 1,
                    jumBocil : 0
                })
            }
        })
    } else {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                res.render('prebooking', {
                    data: result,
                    hours: hours,
                    minutes: minutes,
                    days: days,
                    months: months,
                    jumDewasa : 1,
                    jumBocil : 0
                })
            }
        })
    }
})

app.post('/prebook/:id',(req,res)=>{
    const jumDewasa = parseInt(req.body.dewasa, 10)
    const jumBocil = parseInt(req.body.bocil, 10)
    const id = req.params.id
    const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    if (session.loggedin) {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                res.render('prebooking-logged-in', {
                    data: result,
                    hours: hours,
                    minutes: minutes,
                    days: days,
                    months: months,
                    nama: session.nama,
                    id: session.sId,
                    jumDewasa : jumDewasa,
                    jumBocil: jumBocil
                })
            }
        })
    } else {
        Penerbangan.findById({ _id: id }).exec((err, result) => {
            if (err) {
                console.log('ERROR!!');
            } else {
                console.log('SUCCESS');
                res.render('prebooking', {
                    data: result,
                    hours: hours,
                    minutes: minutes,
                    days: days,
                    months: months,
                    jumDewasa : jumDewasa,
                    jumBocil: jumBocil
                })
            }
        })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('CANT LOG OUY');
        } else {
            session.loggedin = false
            res.redirect('/')
        }
    })
})

app.post('/find', (req, res) => {
    const items = {
        asal: req.body.asal,
        destinasi: req.body.destinasi
        // wktDatang : req.body.tglDatang
    }
    const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
    console.log(items);

    Penerbangan.find(items).limit(5).exec((err, result) => {
        if (err) {
            console.log('error');

        } else {
            console.log('SUCCESS');
            res.render('offers', { data: result, hours: hours, minutes: minutes })

        }
    })
})

app.get('/eticket',(req,res)=>{
    if(session.loggedin){
        res.render('eticket',{nama : session.nama, id: session.sId})
    }else{
        res.redirect('/')
    }
})

app.get('/approve/:id',(req,res)=>{
    const id = req.params.id
    Pesan.findByIdAndDelete({_id : id},(err)=>{
        if (err) {
            console.log('error');
        } else {
            console.log('berhasil');
            res.redirect('/profile/'+ session.sId)
        }
    })
})

app.listen(8000, (err) => {
    if (!err) {
        console.log('Connected to Port 8000')
    }
    else {
        console.log('Error While Connectiong to Port 8000' + err)
    }
})
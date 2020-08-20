const db = require("../models");
const User = db.user;
const Items = db.items
const Quatation = db.quatation;
const Role = db.role;
const errors = require('../config/errors');
const error = errors.errors;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");


exports.addUser = (req, res) => {
    try {
        User.findOne({ where: { email: req.body.email } })
            .then(data => {
                if (data) {
                    res.status(401).send(error.EMAIL_NAME_PRESENT);
                } else {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        mo_no: req.body.mo_no,
                        city: req.body.city,
                        password: bcrypt.hashSync(req.body.password, 8),
                        user_type: "user"
                    })
                        .then(user => {
                            if (req.body.roles) {
                                Role.findAll({
                                    where: {
                                        name: {
                                            [Op.or]: req.body.roles
                                        }
                                    }
                                }).then(roles => {
                                    user.setRoles(roles).then(() => {
                                        res.status(200).send(error.OK)
                                    })
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).send(error.SERVER_ERROR)
                                        });
                                })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send(error.SERVER_ERROR)
                                    });
                            } else {
                                // User Role id = 2
                                user.setRoles([2]).then(() => {
                                    res.status(200).send(error.OK)
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(error.SERVER_ERROR)
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
};

exports.addSupplier = (req, res) => {
    try {
        User.findOne({ where: { user_type: "supplier", mo_no: req.body.mo_no } })
            .then(data => {
                if (data) {
                    res.status(401).send(error.SUPPLIER_PRESENT);
                } else {
                    req.body.user_type = "supplier"
                    User.create(req.body)
                        .then(data => {
                            console.log(data);
                            res.status(200).send(error.OK)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(error.SERVER_ERROR)
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
};

exports.addBuyer = (req, res) => {

    try {
        User.findOne({ where: { user_type: "buyer", mo_no: req.body.mo_no } })
            .then(data => {
                if (data) {
                    res.status(401).send(error.BUYER_PRESENT);
                } else {
                    req.body.user_type = "buyer"
                    User.create(req.body)
                        .then(data => {
                            console.log(data);
                            res.status(200).send(error.OK)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(error.SERVER_ERROR)
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
};

exports.allUsers = (req, res) => {
    try {
        User.findAll({ attributes: { exclude: ['password'] } }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.allBuyersandSuppliers = (req, res) => {
    try {
        User.findAll({
            where: { user_type: ["buyer","supplier"] }, attributes: { exclude: ['password', 'email'] }
        }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.allBuyers = (req, res) => {
    try {
        User.findAll({
            where: { user_type: "buyer" }, attributes: { exclude: ['password', 'email'] }
        }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.allSuppliers = (req, res) => {
    try {
        User.findAll({
            where: { user_type: "supplier" }, attributes: { exclude: ['password', 'email'] }
        }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.User = (req, res) => {
    try {
        const id = req.params.id;
        User.findByPk(id, { attributes: { exclude: ['password'] } })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.USER_NOT_PRESENT
                    res.status(404).send(result)
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.Buyer = (req, res) => {
    try {
        User.findOne({
            where: {
                id: req.params.id,
                user_type: "buyer"
            }, attributes: { exclude: ['password', 'email'] }
        })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.SUPPLIER_NOT_PRESENT
                    res.status(404).send(result)
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.Supplier = (req, res) => {
    try {
        User.findOne({
            where: {
                id: req.params.id,
                user_type: "supplier"
            }, attributes: { exclude: ['password', 'email'] }
        })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.SUPPLIER_NOT_PRESENT
                    res.status(404).send(result)
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteUser = (req, res) => {
    try {
        User.destroy({
            where: { id: req.body.id }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY
                    res.status(200).send(result)
                } else {
                    var result = error.USER_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteBuyer = (req, res) => {
    try {
        User.destroy({
            where: { id: req.body.id, user_type: "buyer" }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.BUYER_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteSupplier = (req, res) => {
    try {
        User.destroy({
            where: { id: req.body.id, user_type: "supplier" }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.SUPPLIER_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateUser = (req, res) => {
    try {
        User.update(req.body, {
            where: { id: req.body.id }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            } else {
                var result = error.USER_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateBuyer = (req, res) => {
    try {
        User.update(req.body, {
            where: { id: req.body.id, user_type: "buyer" }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            } else {
                var result = error.BUYER_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateSupplier = (req, res) => {
    try {
        User.update(req.body, {
            where: { id: req.body.id, user_type: "supplier" }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            }else {
                var result = error.SUPPLIER_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.addQuatation = (req, res) => {
    try {
        Quatation.create(req.body)
            .then(data => {
                console.log(data);
                res.status(200).send(error.OK)
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
};

exports.allQuatations = (req, res) => {
    try {
        Quatation.findAll()
            .then(data => {
                var result = { status: 200, data: data }
                res.status(200).send(result)
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.Quatation = (req, res) => {
    try {
        const id = req.params.id;
        Quatation.findByPk(id)
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data };
                    return res.status(200).send(result);
                } else {
                    var result = error.QUATATION_NOT_PRESENT;
                    return res.status(200).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteQuatation = (req, res) => {
    try {

        Quatation.destroy({
            where: { id: req.body.id }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.QUATATION_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateQuatation = (req, res) => {
    try {

        Quatation.update(req.body, {
            where: { id: req.body.id }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            } else {
                var result = error.QUATATION_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.allSuppliersItems = (req, res) => {
    try {
        Items.findAll({
            where: { item_type: "supplier" }
        }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.SuppliersItem = (req, res) => {
    try {
        Items.findOne({ where: { id: req.params.id, item_type: "supplier" } })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteSuppliersItem = (req, res) => {
    try {

        Items.destroy({
            where: { id: req.body.id, item_type: "supplier" }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateSuppliersItem = (req, res) => {
    try {
        const id = req.body.id;

        Items.update(req.body, {
            where: { id: id, item_type: "supplier" }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            } else {
                var result = error.ITEM_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.allBuyersItems = (req, res) => {
    try {
        Items.findAll({
            where: { item_type: "buyer" }
        }).then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.BuyersItem = (req, res) => {
    try {
        Items.findOne({ where: { id: req.params.id, item_type: "buyer" } })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.deleteBuyersItem = (req, res) => {
    try {
        Items.destroy({
            where: { id: req.body.id, item_type: "buyer" }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateBuyersItem = (req, res) => {
    try {
        Items.update(req.body, {
            where: { id: req.body.id, item_type: "buyer" }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            }else {
                var result = error.ITEM_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.allItems = (req, res) => {
    try {
        Items.findAll().then(data => {
            var result = { status: 200, data: data }
            res.status(200).send(result)
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });

    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.getItemsbyUser_id = (req, res) => {
    try {
        Items.findAll({ where:{user_id:req.params.user_id} })
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.Item = (req, res) => {
    try {
        const id = req.params.id;
        Items.findByPk(id)
            .then(data => {
                if (data) {
                    var result = { status: 200, data: data }
                    res.status(200).send(result)
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.addItem = (req, res) => {
    try {

        Items.findOne({ where: { item_name: req.body.item_name, item_type: req.body.item_type } })
            .then(data => {
                if (data) {
                    res.status(400).send(error.ENTITY_PRESENT);
                } else {
                    Items.create(req.body)
                        .then(data => {
                            console.log(data);
                            res.status(200).send(error.OK)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send(error.SERVER_ERROR)
                        });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}

exports.deleteItem = (req, res) => {
    try {
        Items.destroy({
            where: { id: req.body.id }
        })
            .then(data => {
                if (data == 1) {
                    var result = error.DELETED_SUCCESSFULLY;
                    return res.status(200).send(result);
                } else {
                    var result = error.ITEM_NOT_PRESENT;
                    return res.status(404).send(result);
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(error.SERVER_ERROR)
            });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR);
    }
}

exports.updateItem = (req, res) => {
    try {

        Items.update(req.body, {
            where: { id: req.body.id }
        }).then((data) => {
            if (data == 1) {
                return res.status(200).send(error.UPDATED_SUCESSFULLY);
            } else {
                var result = error.ITEM_NOT_PRESENT;
                return res.status(404).send(result);
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(error.SERVER_ERROR)
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(error.SERVER_ERROR)
    }
}
const fs = require("fs");
const { connect } = require("../config/db");

const updateHostName = (hostname, path) => {
    const hostnameReplace = "hostname		= " + '"' + hostname + '"';
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readFileError, data) => {
            try {
                if (readFileError) {
                    let err = new Error("Error reading config file", {
                        cause: readFileError.message,
                    });
                    throw err;
                }
                data = data.toString();
                data = data.replace(/(hostname).*=.".*"/g, hostnameReplace);
                fs.writeFile(path, data, (err) => {
                    try {
                        if (err === null) resolve(true);
                        let newErr = new Error("Error updating server hostname in config", {
                            cause: err.message,
                        });
                        throw newErr;
                    } catch (newErr) {
                        reject(newErr);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    });
};

const updatePassword = (shouldDefine, password, path) => {
    if (shouldDefine === "1") {
        const passwordReplace = "password		= " + '"' + password + '"';
        return new Promise((resolve, reject) => {
            fs.readFile(path, (readFileError, data) => {
                try {
                    if (readFileError) {
                        let err = new Error("Error reading config file", {
                            cause: readFileError.message,
                        });
                        throw err;
                    }
                    data = data.toString();
                    data = data.replace(/\/?\/?password\W.=.*"/g, passwordReplace);
                    fs.writeFile(path, data, (err) => {
                        try {
                            if (err === null) resolve(true);
                            let newErr = new Error("Error updating server password", {
                                cause: err.message,
                            });
                            throw newErr;
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (readFileError) {
                    reject(readFileError);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            const noPass = '//password		= "NoPassWordDefined"';
            fs.readFile(path, (readError, data) => {
                try {
                    if (readError)
                        throw new Error("Error reading config file", {
                            cause: readError.message,
                        });
                    data = data.toString();
                    data = data.replace(/\/?\/?password\W.=.*"/g, noPass);
                    fs.writeFile(path, data, (writeError) => {
                        try {
                            if (writeError)
                                throw new Error("Error writing to config", {
                                    cause: writeError.message,
                                });
                            resolve(true);
                        } catch (writeError) {
                            reject(writeError);
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
};

const updateAdminPassword = (password, path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr)
                    throw new Error("Error reading config file", {
                        cause: readErr.message,
                    });
                data = data.toString();
                data = data.replace(
                    /(passwordAdmin).*"/g,
                    "passwordAdmin	= " + '"' + password + '"'
                );
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr)
                            throw new Error("Error updating admin password", {
                                cause: writeErr.message,
                            });
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr);
                    }
                });
            } catch (readErr) {
                reject(readErr);
            }
        });
    });
};

const updateMaxPlayers = (playerCount, path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr)
                    throw new Error("Error reading config file", {
                        cause: readErr.message,
                    });
                data = data.toString();
                data = data.replace(
                    /(maxPlayers).*;/g,
                    "maxPlayers		= " + playerCount + ";"
                );
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr)
                            new Error("Error updating max player count", {
                                cause: writeErr.message,
                            });
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr);
                    }
                });
            } catch (readErr) {
                reject(readErr);
            }
        });
    });
};

const updatePersistent = (persistance, path) => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(path, (readErr, data) => {
                if (readErr)
                    throw new Error("Error reading config file", {
                        cause: readErr.message,
                    });
                data = data.toString();
                data = data.replace(
                    /(persisten).*=.[0-1]/g,
                    "persistent		= " + persistance
                );
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr)
                            new Error("Error updating persistent setting", {
                                cause: writeErr.message,
                            });
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr);
                    }
                });
            });
        } catch (readErr) {
            reject(readErr);
        }
    });
};

const updateVON = (value, path) => {
    const disableVONreplace = `disableVoN		= ${value}`;
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr) throw new Error("Error reading config file", {cause: readErr.message,});
                data = data.toString();
                data = data.replace(/(disableVoN).*=.[0|1]/g, disableVONreplace);
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr) throw new Error("Error updating VON settings", {cause: writeErr.message})
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr)
                    }
                });
            } catch (readErr) {
                reject(readErr)
            }
        });
    });
};

const updateMission = (value, path) => {
    const mapMissionReplace = "template = " + '"' + value + '"';
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr) throw new Error("Error reading config file", {cause: readErr.message,});
                data = data.toString();
                data = data.replace(/template.=."(.*?)"/g, mapMissionReplace);
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr) throw new Error("Error updating mission PBO name", {cause: writeErr.message})
                        resolve(true)
                    } catch (writeErr) {
                        reject(writeErr)
                    }
                });
            } catch (readErr) {
                reject(readErr)
            }
        });
    });
};

const updateDifficulty = (value, path) => {
    const mapDifficultyReplace = "difficulty = " + '"' + value + '"';
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr) throw new Error("Error reading config file", {cause: readErr.message})
                data = data.toString();
                data = data.replace(/difficulty.=."(.*?)"/g, mapDifficultyReplace);
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr) throw new Error('Error updating difficulty setting', {cause: err.message})
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr)
                    }
                });
            } catch (readErr) {
                reject(readErr)
            }
        });
    });
};

const updateBattleEye = (value, path) => {
    const battlEyeReplace = `BattlEye				= ${value}`;
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr) throw new Error("Error reading config file", {cause: readErr.message})
                data = data.toString();
                data = data.replace(/(BattlEye).*=.[0-1]/g, battlEyeReplace);
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr) throw new Error('Error updating battleye setting', {cause: err.message})
                        resolve(true);
                    } catch (writeErr) {
                        reject(writeErr)
                    }
                });
            } catch (readErr) {
                reject(readErr)
            }
        });
    });
};

const updateVerifySignatures = (value, path) => {
    const verifySignaturesReplace = `verifySignatures		= ${value}`;
    return new Promise((resolve, reject) => {
        fs.readFile(path, (readErr, data) => {
            try {
                if (readErr) throw new Error("Error reading config file", {cause: readErr.message})
                data = data.toString();
                data = data.replace(
                    /(verifySignatures).*=.[0|2]/g,
                    verifySignaturesReplace
                );
                fs.writeFile(path, data, (writeErr) => {
                    try {
                        if (writeErr) throw new Error('Error updating battleye setting', {cause: err.message})
                        resolve(true)
                    } catch (writeErr) {
                        reject(writeErr)    
                    }
                });
            } catch (readErr) {
                reject(readErr)
            }
        });
    });
};

const updateConfig = (
    {
        hostname,
        adminPassword,
        maxPlayers,
        persistance,
        VON,
        PBOname,
        difficulty,
        battleye,
        verifySigs,
    },
    { userPassword: { shouldDefine, UserPass } }
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await connect()
            db.all('SELECT ARMA_SERVER_LOC from server_config WHERE server_id = 1',[],async(err, data) => {
                try {
                    if (err) throw new Error('Could not find Arma install path', {cause: err.message})
                    const path = data[0].ARMA_SERVER_LOC+"/config.cfg"
                    console.log(path)
                    await updateHostName(hostname, path)
                    await updatePassword(shouldDefine, UserPass, path)
                    await updateAdminPassword(adminPassword, path)
                    await updateMaxPlayers(maxPlayers, path)
                    await updatePersistent(persistance, path)
                    await updateVON(VON, path)
                    await updateMission(PBOname, path)
                    await updateDifficulty(difficulty, path)
                    await updateBattleEye(battleye, path)
                    await updateVerifySignatures(verifySigs, path)
                    resolve(true);
                    console.info("Successfully updated config");
                } catch (err) {
                    reject(err)
                }
            })
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    updateConfig: updateConfig,
};

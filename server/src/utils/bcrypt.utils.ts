import bcrypt from "bcryptjs";

// * hash password
export const hashPassword = async (password : string) =>{
    try {

        //salt / why do we use salt 

        //  const salt = await bcrypt.getSalt(10);
        const salt = await bcrypt.genSalt(10);
        //hash

        const hash = await bcrypt.hash(password, salt);
        return hash; 

    }
    catch(error){
        console.log(error)
        throw error; 
        
    }
}

//* compare password 

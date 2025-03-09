This is used for the exporting the types of different functionalities like : 
1) signupInput 
2) signinInput etc... 



export type signupInput = z.infer<typeof signupInput>
export type signinInput = z.infer<typeof signinInput>
export type createblogInput = z.infer<typeof createblogInput>
export type updateblog = z.infer<typeof updateblog>
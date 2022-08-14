// import {
//     ArgumentsHost,
//     Catch,
//     ExceptionFilter,
//     ForbiddenException,
//     UnauthorizedException,
//   } from '@nestjs/common'
//   import { Response } from 'express'
//     import { pass_42Guard } from './auth/guards/jwt-auth.guard'
  
//   @Catch(UnauthorizedException, ForbiddenException)
//   export class Unauthorized implements ExceptionFilter {
//     constructor(private readonly strategy:  pass_42Guard) {}
//     catch(
//       _exception: ForbiddenException | UnauthorizedException,
//       host: ArgumentsHost,
//     ) {
//       console.log(
//         _exception instanceof ForbiddenException ? `@Forbidden` : `@Unauthorized`,
//       )
//       const ctx = host.switchToHttp()
//       const response = ctx.getResponse<Response>()
//       response.redirect("http://127.0.0.1:3000/login")
//     }
//   }
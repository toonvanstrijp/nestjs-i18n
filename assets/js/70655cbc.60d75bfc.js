"use strict";(self.webpackChunknestjs_i18n=self.webpackChunknestjs_i18n||[]).push([[7715],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>g});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),m=p(n),c=i,g=m["".concat(s,".").concat(c)]||m[c]||u[c]||r;return n?a.createElement(g,o(o({ref:t},d),{},{components:n})):a.createElement(g,o({ref:t},d))}));function g(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:i,o[1]=l;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},42:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>l,toc:()=>p});var a=n(7462),i=(n(7294),n(3905));const r={sidebar_position:1},o="Global validation",l={unversionedId:"guides/dto_validation/global-validation",id:"guides/dto_validation/global-validation",title:"Global validation",description:"To use nestjs-i18n in your DTO validation you first need to follow the nestjs instructions. After that you need to use the I18nValidationPipe.",source:"@site/docs/guides/dto_validation/global-validation.md",sourceDirName:"guides/dto_validation",slug:"/guides/dto_validation/global-validation",permalink:"/guides/dto_validation/global-validation",draft:!1,editUrl:"https://github.com/toonvanstrijp/nestjs-i18n/tree/main/docs/guides/dto_validation/global-validation.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Debugging",permalink:"/guides/debugging"},next:{title:"Manual validation",permalink:"/guides/dto_validation/manual-validation"}},s={},p=[{value:"DTO definition",id:"dto-definition",level:3},{value:"Translations",id:"translations",level:3},{value:"Filter",id:"filter",level:3},{value:"I18nValidationExceptionFilterOptions",id:"i18nvalidationexceptionfilteroptions",level:4},{value:"Response",id:"response",level:3},{value:"Example",id:"example",level:2}],d={toc:p},m="wrapper";function u(e){let{components:t,...n}=e;return(0,i.kt)(m,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"global-validation"},"Global validation"),(0,i.kt)("p",null,"To use ",(0,i.kt)("inlineCode",{parentName:"p"},"nestjs-i18n")," in your DTO validation you first need to follow the ",(0,i.kt)("a",{parentName:"p",href:"https://docs.nestjs.com/techniques/validation"},(0,i.kt)("strong",{parentName:"a"},"nestjs instructions")),". After that you need to use the ",(0,i.kt)("inlineCode",{parentName:"p"},"I18nValidationPipe"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/main.ts"',title:'"src/main.ts"'},"import { i18nValidationErrorFactory } from 'nestjs-i18n';\n\napp.useGlobalPipes(\n  new I18nValidationPipe(),\n);\n")),(0,i.kt)("h3",{id:"dto-definition"},"DTO definition"),(0,i.kt)("p",null,"Inside your DTO class define all your properties and validators. The important thing here is to use the ",(0,i.kt)("inlineCode",{parentName:"p"},"i18nValidationMessage")," helper function inside the ",(0,i.kt)("inlineCode",{parentName:"p"},"message")," property."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/dto/create-user.dto.ts"',title:'"src/dto/create-user.dto.ts"'},"import {\n  IsBoolean,\n  IsDefined,\n  IsEmail,\n  IsNotEmpty,\n  Max,\n  Min,\n  ValidateNested,\n} from 'class-validator';\nimport { Type } from 'class-transformer';\nimport { i18nValidationMessage } from 'nestjs-i18n';\n\nexport class ExtraUserDto {\n  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })\n  subscribeToEmail: string;\n\n  @Min(5, {\n    message: i18nValidationMessage('validation.MIN', { message: 'COOL' }),\n  })\n  min: number;\n\n  @Max(10, {\n    message: i18nValidationMessage('validation.MAX', { message: 'SUPER' }),\n  })\n  max: number;\n}\n\nexport class CreateUserDto {\n  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })\n  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })\n  email: string;\n\n  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })\n  password: string;\n\n  @ValidateNested()\n  @IsDefined()\n  @Type(() => ExtraUserDto)\n  extra: ExtraUserDto;\n}\n")),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"By using the ",(0,i.kt)("inlineCode",{parentName:"p"},"i18nValidationMessage")," helper function you can pass in extra arguments or make use of internal ",(0,i.kt)("inlineCode",{parentName:"p"},"class-validator")," properties such as ",(0,i.kt)("inlineCode",{parentName:"p"},"property"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"value"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"constraints.0"),".")),(0,i.kt)("h3",{id:"translations"},"Translations"),(0,i.kt)("p",null,"Inside your translation you now can use ",(0,i.kt)("inlineCode",{parentName:"p"},"class-validator")," properties such as ",(0,i.kt)("inlineCode",{parentName:"p"},"property"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"value")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"constraints.0"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="src/i18n/en/validation.json"',title:'"src/i18n/en/validation.json"'},'{\n  "NOT_EMPTY": "{property} cannot be empty",\n  "INVALID_EMAIL": "email is invalid",\n  "INVALID_BOOLEAN": "{property} is not a boolean",\n  "MIN": "{property} with value: \\"{value}\\" needs to be at least {constraints.0}, ow and {message}",\n  "MAX": "{property} with value: \\"{value}\\" needs to be less than {constraints.0}, ow and {message}"\n}\n')),(0,i.kt)("h3",{id:"filter"},"Filter"),(0,i.kt)("p",null,"For ",(0,i.kt)("inlineCode",{parentName:"p"},"nestjs-i18n")," to translate the ",(0,i.kt)("inlineCode",{parentName:"p"},"class-validator")," errors add the ",(0,i.kt)("inlineCode",{parentName:"p"},"I18nValidationExceptionFilter")," on your controller or globally."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/app.controller.ts"',title:'"src/app.controller.ts"'},"import { I18nValidationExceptionFilter } from 'nestjs-i18n';\n\n@Post()\n@UseFilters(new I18nValidationExceptionFilter())\ncreate(@Body() createUserDto: CreateUserDto): any {\n    return 'This action adds a new user';\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="src/main.ts"',title:'"src/main.ts"'},"import { I18nValidationExceptionFilter } from 'nestjs-i18n';\n\napp.useGlobalFilters(new I18nValidationExceptionFilter());\n")),(0,i.kt)("h4",{id:"i18nvalidationexceptionfilteroptions"},"I18nValidationExceptionFilterOptions"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"I18nValidationExceptionFilter")," also takes an argument of type ",(0,i.kt)("inlineCode",{parentName:"p"},"I18nValidationExceptionFilterOptions")),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Name"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Required"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"detailedErrors")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"boolean")),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"true")),(0,i.kt)("td",{parentName:"tr",align:null},"Simplify error messages")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"errorFormatter")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"(errors: ValidationError[]) => object")),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"Return the validation errors in a format that you specify.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"errorHttpStatusCode")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"HttpStatus")),(0,i.kt)("td",{parentName:"tr",align:null},"false"),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"400")),(0,i.kt)("td",{parentName:"tr",align:null},"Change the default http status code for the ",(0,i.kt)("inlineCode",{parentName:"td"},"I18nValidationException"),".")))),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"Note that only one of the properties ",(0,i.kt)("inlineCode",{parentName:"p"},"detailedErrors")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"errorFormatter")," can be used at the time.")),(0,i.kt)("h3",{id:"response"},"Response"),(0,i.kt)("p",null,"Now your validation errors are being translated \ud83c\udf89!"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="response"',title:'"response"'},'{\n  "statusCode": 400,\n  "errors": [\n    {\n      "property": "email",\n      "children": [],\n      "constraints": {\n        "isEmail": "email is invalid",\n        "isNotEmpty": "email cannot be empty"\n      }\n    },\n    {\n      "property": "password",\n      "children": [],\n      "constraints": { "isNotEmpty": "password cannot be empty" }\n    },\n    {\n      "property": "extra",\n      "children": [\n        {\n          "property": "subscribeToEmail",\n          "children": [],\n          "constraints": {\n            "isBoolean": "subscribeToEmail is not a boolean"\n          }\n        },\n        {\n          "property": "min",\n          "children": [],\n          "constraints": {\n            "min": "min with value: \\"1\\" needs to be at least 5, ow and COOL"\n          }\n        },\n        {\n          "property": "max",\n          "children": [],\n          "constraints": {\n            "max": "max with value: \\"100\\" needs to be less than 10, ow and SUPER"\n          }\n        }\n      ],\n      "constraints": {}\n    }\n  ]\n}\n')),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"If you want a different output, create your own interceptor! For an example look at the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/toonvanstrijp/nestjs-i18n/blob/main/src/filters/i18n-validation-exception.filter.ts"},(0,i.kt)("inlineCode",{parentName:"a"},"I18nValidationExceptionFilter")),".")),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"A working example is available ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/toonvanstrijp/nestjs-i18n/tree/main/samples/dt-validation"},"here"),"."))}u.isMDXComponent=!0}}]);
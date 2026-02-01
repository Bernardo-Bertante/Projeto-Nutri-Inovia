/backend
├── src
│ ├── /common # Recursos compartilhados
│ │ ├── /decorators # Ex: @CurrentUser()
│ │ ├── /filters # Tratamento de exceções
│ │ └── /guards # JWT Auth Guards
│ │
│ ├── /config # Configurações (ex: Variáveis de ambiente, Swagger)
│ │
│ ├── /database
│ │ ├── /schemas # Schemas do Mongoose globais (se houver)
│ │ └── /seeds # Script para criar os 2 nutricionistas iniciais [cite: 116]
│ │
│ ├── /modules
│ │ │
│ │ ├── /auth # Módulo de Autenticação [cite: 59]
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.module.ts
│ │ │ └── /strategies # Estratégia JWT
│ │ │
│ │ ├── /nutritionist # Módulo Nutricionista (Apenas Schema/Leitura, sem CRUD completo)
│ │ │ ├── nutritionist.repository.ts # Abstração do Mongoose
│ │ │ ├── nutritionist.schema.ts # Definição do Modelo Mongoose [cite: 114]
│ │ │ └── nutritionist.module.ts
│ │ │
│ │ └── /appointment # Módulo Principal de Consultas [cite: 109]
│ │ ├── appointment.controller.ts # Recebe requisições (POST, GET, etc.)
│ │ ├── appointment.service.ts # Regras: Recorrência [cite: 111], Validação de Conflitos
│ │ ├── appointment.repository.ts # Camada de acesso a dados (Mongoose)
│ │ ├── appointment.module.ts
│ │ ├── /schemas # Schema do Mongoose para Consultas [cite: 115]
│ │ │ └── appointment.schema.ts
│ │ ├── /dtos # DTOs com class-validator
│ │ │ ├── create-appointment.dto.ts
│ │ │ └── update-appointment.dto.ts
│ │ └── /interfaces
│ │ └── appointment.interface.ts
│ │
│ ├── app.module.ts # Módulo raiz
│ └── main.ts # Ponto de entrada (Setup do Swagger e ValidationPipe) [cite: 108]
│
├── Dockerfile # Configuração da imagem Docker do Backend [cite: 125]
├── package.json
└── tsconfig.json

variable "zone" {
  type    = string
  default = "ru-central1-a"
}

variable "network" {
  type    = string
  default = "ya-network"
}

variable "subnet" {
  type    = string
  default = "ya-network"
}

variable "subnet_v4_cidr_blocks" {
  type    = list(string)
  default = ["192.168.10.0/24"]
}

variable "nat" {
  type    = bool
  default = true
}

variable "image_family" {
  type    = string
  default = "ubuntu-2204-lts"
}

variable "name" {
  type    = string
}

variable "cores" {
  type    = number
  default = 2
}

variable "memory" {
  type    = number
  default = 4
}

variable "disk_size" {
  type    = number
  default = 20
}

variable "disk_type" {
  type    = string
  default = "network-nvme"
}

variable "user_name" {
  default = "march"
  type    = string
}

variable "user_pass" {
  default = "march"
  type    = string
}

variable "admin_pass" {
  default = "march"
  type    = string
}

variable "db_user" {
  default = "march"
  type    = string
}

variable "db_password" {
  default = "max_marchenko"
  type    = string
}

variable "ssh_public_key" {
  type    = string
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCdzAGv7UF7JZopymGAdRIyShfeqxiNdtRQuImuGY4G/JX8o/GO51R79uthdQDeOZLG6+85owvLhKA3HHLAqzPAuY+ReUGiNV0212+vXQ+5li0vULnKlwVXDfKV72datlWsKbSusJkG22KzLYvyb9dM52xQbolUMF05v7bpkJ2cXngeX9SMyIVKr3nvTUsGI933HywxRlJ0Cu96JIKSJHGV7EmUC4e+CLmLlSczBx0T4tCwHastkQkqyjdom6+BKTNTXy+/KA5k1UoMl86RjlPYYzCsCqVaiY9a0zYHUHM7PWwMzwUqS5Sv+KkAYC2jJQXPga9cB85fd/8t/1waYYD5"
}

variable "timeout_create" {
  default = "10m"
}

variable "timeout_delete" {
  default = "10m"
}


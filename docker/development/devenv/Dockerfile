FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Set up some core packages
RUN apt-get update
RUN apt-get install -y sudo curl software-properties-common mysql-client

RUN add-apt-repository ppa:git-core/ppa && apt-get update && apt-get install -y git

# Install Node.js 18 and packages needed to build native packages
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs gcc g++ make python3

CMD ["sleep", "infinity"]

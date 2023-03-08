#include<bits/stdc++.h>
using namespace std;
int main(){
  int n;
  cin>>n;
  int ans=0,r=5;
  while((n/r)>0){
    ans+=(n/r);
    r*=5;
  }
  cout<<ans;
  return 0;
}




















